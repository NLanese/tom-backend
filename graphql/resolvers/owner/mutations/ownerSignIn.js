import db from "../../../../utils/generatePrisma.js";
import bcrypt from "bcryptjs";
import { UserInputError } from 'apollo-server-errors';
import { validateLoginInput } from "../../../../utils/validators.js";
import generateOwnerToken from "../../../../utils/generateToken/generateOwnerToken.js"

export default {
    Mutation: {
        ownerSignIn: async (_, { email, password }, { req }) => {
            const { errors, valid } = validateLoginInput(email, password)
    
            if (!valid) {
                throw new UserInputError('Errors', {
                    errors
                })
            }
    
            email = await email.toUpperCase()
    
            const foundUser = await db.owner.findUnique({
                where: {
                    email
                }
            })
    
            if (!foundUser) {
                errors.general = 'Account not found';
                throw new UserInputError('Incorrect Email', {
                    errors
                });
            }
    
            const isValid = await bcrypt.compare(password, foundUser.password)
    
            if (!isValid) {
                errors.general = 'Incorrect Password'
                throw new UserInputError('Incorrect Password', {
                    errors
                })
            }
    
            const token = await generateOwnerToken(foundUser.id)

            req.session = {
                token: `Bearer ${token}`
            }
    
            try {
                return await db.owner.update({
                    where: {
                        id: foundUser.id
                    },
                    data: {
                        ...foundUser,
                        token: token
                    }
                })
                // return await {
                //     ...foundUser,
                //     token: token
                // }
            } catch (error) {
                console.log(error)
                throw new Error(error)
            }
        }
    }
}