import db from "../../../../utils/generatePrisma.js";
import hashPassword from "../../../../utils/passwordHashing.js";
import generateDriverToken from "../../../../utils/generateToken/generateDriverToken.js"
import { UserInputError } from 'apollo-server-errors';
import { validateRegisterInput } from "../../../../utils/validators.js";

/* SIGNS UP THE DRIVER AND RELATES THEM TO THE OWNER AND ALL THEIR MANAGERS */
export default {
    Mutation: {
        driverSignUp: async (_, {
            email,
            password,
            firstname,
            lastname,
            phoneNumber,
            signUpToken
        }, { req }) => {
            const { valid, errors } = validateRegisterInput(email, password)

            if (!valid) {
                throw new UserInputError('Errors', {
                    errors
                })
            }

            email = await email.toUpperCase()
            firstname = await firstname.toUpperCase()
            lastname = await lastname.toUpperCase()

            const driver = await db.driver.findUnique({
                where: {
                    email
                }
            })

            if (driver) {
                throw new UserInputError('email is taken', {
                    errors: {
                        email: 'Email is already taken',
                    },
                });
            }

            password = await hashPassword(password)

            const owner = await db.owner.findUnique({
                where: {
                    signUpToken: signUpToken
                },
                include: {
                    admins: true,
                    dsp: true,
                    chatrooms: true
                }
            })

            if (!owner) {
                throw new Error('Owner does not exist')
            }

            const justOwnerRecord = await db.owner.findUnique({
                where: {
                    id: owner.id
                }
            })
            
            try {
                let newDriver
                let guestArray = []

                if (owner.dsp) {
                    newDriver = await db.driver.create({
                        data: {
                            owner: {
                                connect: {
                                    id: owner.id
                                }
                            },
                            dsp: {
                                connect: {
                                    id: owner.dsp.id
                                }
                            },
                            email: email,
                            password: password,
                            firstname: firstname,
                            lastname: lastname,
                            phoneNumber: phoneNumber
                        }
                    })
                }

                if (!owner.dsp) {
                    newDriver = await db.driver.create({
                        data: {
                            owner: {
                                connect: {
                                    id: owner.id
                                }
                            },
                            email: email,
                            password: password,
                            firstname: firstname,
                            lastname: lastname,
                            phoneNumber: phoneNumber
                        }
                    })
                }

                await owner.admins.forEach( async (admin) => {
                    await guestArray.push(admin)

                    const foundAdmin = await db.admin.findUnique({
                        where: {
                            id: admin.id
                        }
                    })

                    if (foundAdmin) {
                        await db.driver.update({
                            where: {
                                id: newDriver.id
                            },
                            data: {
                                admins: {
                                    connect: {
                                        id: admin.id 
                                    }
                                },
                            }
                        })
                    }
                })


                const newChatroom = await db.chatroom.create({
                    data: {
                        guests: [ newDriver, justOwnerRecord, ...guestArray ],
                        chatroomOwner: justOwnerRecord,
                        chatroomName: `${newDriver.firstname} ${newDriver.lastname} management chatroom`,
                        owner: {
                            connect: {
                                id: owner.id
                            }
                        }
                    }
                })

                await db.chatroom.update({
                    where: {
                        id: newChatroom.id
                    },
                    data: {
                        drivers: {
                            connect: {
                                id: newDriver.id
                            }
                        }
                    }
                })

                await guestArray.forEach( async (guest) => {
                    await db.chatroom.update({
                        where: {
                            id: newChatroom.id
                        },
                        data: {
                            managers: {
                                connect: {
                                    id: guest.id
                                }
                            }
                        }
                    })
                })

                await owner.chatrooms.forEach( async (chatroom) => {
                    if (chatroom.chatroomName === `${owner.dsp.name} chatroom`) {
                        const foundChatroom = await db.chatroom.findUnique({
                            where: {
                                id: chatroom.id
                            }
                        })

                        const guestDspArray = await foundChatroom.guests

                        await db.chatroom.update({
                            where: {
                                id: chatroom.id
                            },
                            data: {
                                drivers: {
                                    connect: {
                                        id: newDriver.id
                                    }
                                },
                                guests: [ ...guestDspArray, newDriver]
                            }
                        })
                    }
                })

                const token = await generateDriverToken(newDriver.id)

                req.session = {
                    token: `Bearer ${token}`
                }

                return {
                    ...newDriver,
                    token: token
                }
            } catch (error) {
                console.log(error)
                throw new Error(error)
            }
        }
    }
}