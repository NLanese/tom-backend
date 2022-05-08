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
    
            
            const findUser = (users) => {
                let isValid = false
                let rUser = false
                foundUsers.forEach(  (user) => {
                    let test =  bcrypt.compare(password, user.password)
                    console.log(test)
                    if (test){
                        isValid = true
                        rUser = user
                    }
                })
                if (isValid){
                    console.log("hit true")
                    return rUser
                }
                else{
                    console.log("hit false")
                    return false
                }
            }

                // If false
                if (!findUser(foundUsers)) {
                    errors.general = 'Incorrect Password'
                    throw new UserInputError('Incorrect Password', {
                        errors
                    })
                }


                const token =  generateDriverToken(findUser(foundUsers).id)
                req.session = {
                    token: `Bearer ${token}`
                }
    
                try {
                    return  {
                        ...findUser(foundUsers),
                        token: token
                    }
                } catch (error) {
                    throw new Error(error)
                }
            

            

            
        }
    }
}