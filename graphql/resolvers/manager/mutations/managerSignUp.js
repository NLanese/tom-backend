import db from "../../../../utils/generatePrisma.js";
import hashPassword from "../../../../utils/passwordHashing.js";
import { UserInputError } from 'apollo-server-errors';
import { validateRegisterInput } from "../../../../utils/validators.js";
import generateAdminToken from "../../../../utils/generateToken/generateAdminToken.js"

/* SIGNS UP THE MANAGER AND RELATES THEM TO THE OWNER */
export default {
    Mutation: {
        managerSignUp: async (_, {
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

            const foundManager = await db.admin.findUnique({
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
                    newManager = await db.admin.create({
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
                    newManager = await db.admin.create({
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
                        await db.admin.update({
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

                const token = await generateAdminToken(newManager.id)

                req.session = {
                    token: `Bearer ${token}`
                }

                return {
                    ...newManager,
                    token: token
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}