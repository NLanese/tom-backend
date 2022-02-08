import db from "../../../../utils/generatePrisma.js";
import { validateLoginInput } from "../../../../utils/validators.js";
import { UserInputError } from 'apollo-server-errors';
import generateManagerToken from "../../../../utils/generateToken/generateManagerToken.js";
import bcrypt from "bcryptjs";


export default {
    Mutation: {
        managerSignIn: async (_, {
            email,
            password
        }, { req }) => {
            const { errors, valid } = validateLoginInput(email, password)
    
            if (!valid) {
                throw new UserInputError('Errors', {
                    errors
                })
            }
    
            email = await email.toUpperCase()
    
            const foundUser = await db.manager.findUnique({
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
    
            const token = await generateManagerToken(foundUser.id)
    
            req.session = {
                token: `Bearer ${token}`
            }
    
            try {
                return {
                    ...foundUser,
                    token: token
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}