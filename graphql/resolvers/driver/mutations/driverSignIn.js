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
            const foundUsers = await db.driver.findMany({
                where: {
                    email
                },
                include: {
                    owner: true,
                    managers: true,
                    dsp: true,
                    weeklyReport: true,
                    chatrooms: {
                        include: {
                            messages: true
                        }
                    },
                    notifiedMessages: true,
                }
            })
            if (!foundUsers || foundUsers.length < 1) {
                errors.general = 'Account not found';
                throw new UserInputError('Incorrect Email', {
                    errors
                });
            }
    
            let isValid = false
            let foundUser = false
            let cap = foundUsers.length
            let i = 0

            while (i < cap){
                foundUsers.forEach( async (user) => {
                    let test = await bcrypt.compare(password, user.password)
                    console.log(test)
                    if (test){
                        isValid = true
                        console.log(isValid)
                        foundUser = user
                    }
                    i++
                })
            }

            if (!isValid) {
                console.log(isValid)
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
                return await {
                    ...foundUser,
                    token: token
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}