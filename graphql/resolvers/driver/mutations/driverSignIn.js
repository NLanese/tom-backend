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
            try {
                const foundUser = await db.driver.findUnique({
                    where: {
                        email
                    },
                    include: {
                        owner: true,
                        managers: true,
                        dsp: {
                            include: {
                                drivers: {
                                    include: {
                                        weeklyReport: true
                                    }
                                },
                            }
                        },
                        weeklyReport: true,
                        // shifts: true,
                        chatrooms: {
                            include: {
                                messages: true
                            }
                        },
                        notifiedMessages: true,
                    }
                }) 
                if (!foundUser) {
                    console.log("No driver found")
                    errors.general = 'Account not found';
                    throw new UserInputError('Incorrect Email', {
                        errors
                    });
                }
                if (!bcrypt.compare(password, foundUser.password)){
                    throw new Error("Wrong Passowrd!")
                }
                else{
                    const token =  generateDriverToken(foundUser.id)
                    req.session = {
                        token: `Bearer ${token}`
                    }
    
                    try {
                        return  {
                            ...foundUser,
                            token: token
                        }
                    } catch (error) {
                        throw new Error(error)
                    }
                }
            } catch(err){
                console.log(err)
            }
            

            
    
        

            
            
        }
    }
}