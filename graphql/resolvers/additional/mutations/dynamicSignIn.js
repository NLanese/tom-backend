import db from "../../../../utils/generatePrisma.js";
import bcrypt from "bcryptjs";
import { UserInputError } from 'apollo-server-errors';
import { validateLoginInput } from "../../../../utils/validators.js";
import generateOwnerToken from "../../../../utils/generateToken/generateOwnerToken.js"
import generateManagerToken from "../../../../utils/generateToken/generateManagerToken.js";

export default {
    Mutation: {
        dynamicSignIn: async (_, { email, password }, { req }) => {
            const { errors, valid } = validateLoginInput(email, password)
    
            if (!valid) {
                throw new UserInputError('Errors', {
                    errors
                })
            }
    
            email = await email.toUpperCase()

            const foundOwner = await db.owner.findUnique({
                where: {
                    email
                },
                include: {
                    drivers: true,
                    managers: true,
                    dsp: {
                        include: {
                            owner: true
                        }
                    },
                    messages: true,
                    notifiedMessages: true,
                    chatrooms: {
                        include: {
                            messages: true
                        }
                    }
                }
            })

            const foundManager = await db.manager.findUnique({
                where: {
                    email
                },
                include: {
                    drivers: true,
                    dsp: {
                        include: {
                            owner: true
                        }
                    },
                    messages: true,
                    notifiedMessages: true,
                    chatrooms: {
                        include: {
                            messages: true
                        }
                    }
                }
            })

            if (!foundOwner && !foundManager) {
                errors.general = 'Account not found';
                throw new UserInputError('Incorrect Email', {
                    errors
                });
            }

            if (foundOwner) {
                const isValid = await bcrypt.compare(password, foundOwner.password)
    
                if (!isValid) {
                    errors.general = 'Incorrect Password'
                    throw new UserInputError('Incorrect Password', {
                        errors
                    })
                }

                const token = await generateOwnerToken(foundOwner.id)

                req.session = {
                    token: `Bearer ${token}`
                }

                try {
                    return await {
                        ...foundOwner,
                        token: token
                    }
                } catch (error) {
                    throw new Error(error)
                }
            }

            if (foundManager) {
                const isValid = await bcrypt.compare(password, foundManager.password)
    
                if (!isValid) {
                    errors.general = 'Incorrect Password'
                    throw new UserInputError('Incorrect Password', {
                        errors
                    })
                }

                const token = await generateManagerToken(foundManager.id)

                req.session = {
                    token: `Bearer ${token}`
                }

                try {
                    return await {
                        ...foundManager,
                        token: token
                    }
                } catch (error) {
                    throw new Error(error)
                }

            }
        }
    }
}