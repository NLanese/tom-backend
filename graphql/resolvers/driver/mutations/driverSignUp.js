import db from "../../../../utils/generatePrisma.js";
import hashPassword from "../../../../utils/passwordHashing.js";
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
        }, context) => {
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
                    dsp: true
                }
            })

            if (!owner) {
                throw new Error('Owner does not exist')
            }
            
            try {
                let newDriver

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

                owner.admins.forEach( async (admin) => {
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

                return newDriver
            } catch (error) {
                console.log(error)
                throw new Error(error)
            }
        }
    }
}