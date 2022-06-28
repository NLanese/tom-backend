import db from "../../../../utils/generatePrisma.js";
import hashPassword from "../../../../utils/passwordHashing.js";
import { UserInputError } from 'apollo-server-errors';
import { validateRegisterInput } from "../../../../utils/validators.js";
import generateManagerToken from "../../../../utils/generateToken/generateManagerToken.js"

/* SIGNS UP THE MANAGER AND RELATES THEM TO THE OWNER */
export default {
    Mutation: {
        managerSignUp: async (_, {
            email,
            password,
            firstname,
            lastname,
            phoneNumber,
            signupToken
        }, { req }) => {

            console.log("hit")

            const { valid, errors } = validateRegisterInput(email, password)

            if (!valid) {
                throw new UserInputError('Errors', {
                    errors
                })
            }

            email = await email.toUpperCase()
            firstname = await firstname.toUpperCase()
            lastname = await lastname.toUpperCase()

            const foundManager = await db.manager.findUnique({
                where: {
                    email
                },
            });

            const foundOwner = await db.owner.findUnique({
                where: {
                    email
                }
            })

            if (foundManager || foundOwner) {
                throw new UserInputError('Email is already in use', {
                    errors: {
                        email: 'Email is already in use',
                    },
                });
            }

            password = await hashPassword(password)

            ownerEmail = ownerEmail.toUpperCase()

            const owner = await db.owner.findUnique({
                where: {
                    signUpToken: signupToken
                },
                include: {
                    drivers: true,
                    dsp: true,
                    chatrooms: true
                }
            })

            if (!owner) {
                throw new Error('Owner does not exist')
            }

            try {
                let newManager

                if (owner.dsp) {
                    newManager = await db.manager.create({
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
                    newManager = await db.manager.create({
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

                owner.drivers.forEach( async (driver) => {
                    const foundDriver = await db.driver.findUnique({
                        where: {
                            id: driver.id
                        }
                    })

                    if (foundDriver) {
                        await db.manager.update({
                            where: {
                                id: newManager.id
                            },
                            data: {
                                drivers: {
                                    connect: {
                                        id: driver.id
                                    }
                                }
                            }
                        })
                    }
                })

                if (owner.chatrooms) {
                    owner.chatrooms.forEach( async (chatroom) => {
                        if (chatroom.managerJoinOnSignUp === true) {
                            let guestArray = []
                            
                            chatroom.guests.forEach( async (guest) => {
                                guestArray.push(guest)
                                
                            })
    
                            guestArray.push(newManager)
    
                            await db.chatroom.update({
                                where: {
                                    id: chatroom.id
                                },
                                data: {
                                    managers: {
                                        connect: {
                                            id: newManager.id
                                        }
                                    },
                                    guests: [ ...guestArray ]
                                }
                            })
                        }
                    })
                }

                const token = await generateManagerToken(newManager.id)

                req.session = {
                    token: `Bearer ${token}`
                }

                return await db.manager.update({
                    where: {
                        id: newManager.id
                    },
                    data: {
                        email: email,
                        password: password,
                        firstname: firstname,
                        lastname: lastname,
                        phoneNumber: phoneNumber,
                        profilePick: 'Default',
                        token: token
                    }
                })

                // return await {
                //     ...newManager,
                //     token: token
                // }
            } catch (error) {
                console.log(error)
                throw new Error(error)
            }
        }
    }
}