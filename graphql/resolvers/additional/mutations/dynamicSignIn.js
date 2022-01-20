import db from "../../../../utils/generatePrisma.js";
import bcrypt from "bcryptjs";
import { UserInputError } from 'apollo-server-errors';
import { validateLoginInput } from "../../../../utils/validators.js";
import generateOwnerToken from "../../../../utils/generateToken/generateOwnerToken.js"
import generateAdminToken from "../../../../utils/generateToken/generateAdminToken.js";

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
                }
            })

            const foundManager = await db.admin.findUnique({
                where: {
                    email
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
                    return {
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

                const token = await generateAdminToken(foundManager.id)

                req.session = {
                    token: `Bearer ${token}`
                }

                try {
                    return {
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