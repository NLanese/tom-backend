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
                throw new UserInputError('Email is already in use', {
                    errors: {
                        email: 'Email is already in use',
                    },
                });
            }

            password = await hashPassword(password)

            const owner = await db.owner.findUnique({
                where: {
                    signUpToken: signUpToken
                },
                include: {
                    managers: true,
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
                            phoneNumber: phoneNumber,
                            profilePick: "Default"
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
                            phoneNumber: phoneNumber,
                            profilePick: "Default"
                        }
                    })
                }

                await owner.managers.forEach( async (manager) => {
                    await guestArray.push(manager)

                    const foundManager = await db.manager.findUnique({
                        where: {
                            id: manager.id
                        }
                    })

                    if (foundManager) {
                        await db.driver.update({
                            where: {
                                id: newDriver.id
                            },
                            data: {
                                managers: {
                                    connect: {
                                        id: manager.id 
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
                    if (chatroom.driverJoinOnSignUp === true) {
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

                return await {
                    ...newDriver,
                    token: token
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}