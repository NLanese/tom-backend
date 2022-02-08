import db from "../../../../utils/generatePrisma.js";
import { validateLoginInput } from "../../../../utils/validators.js";
import { UserInputError } from 'apollo-server-errors';
import generateDriverToken from "../../../../utils/generateToken/generateDriverToken.js";
import bcrypt from "bcryptjs";

export default {
    Mutation: {
        driverSignIn: async (_, {
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
    
            const foundUser = await db.driver.findUnique({
                where: {
                    email
                },
                include: {
                    owner: true,
                    managers: true,
                    dsp: true,
                    weeklyReport: true
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

            const token = await generateDriverToken(foundUser.id)

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