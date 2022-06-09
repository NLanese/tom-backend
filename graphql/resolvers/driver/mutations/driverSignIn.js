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
                    throw new Error("No User exists with this email!")
                }
                let passing = await bcrypt.compare(password, foundUser.password)
                if (!passing){
                    throw new Error("Wrong Passowrd!")
                }
                else if (passing){
                    const token =  generateDriverToken(foundUser.id)
                    req.session = {
                        token: `Bearer ${token}`
                    }
                    console.log("INSIDE OF DRIVER SIGN IN THIS IS THE RETURN OBJECT\n===================")
                    console.log({
                        ...foundUser,
                        token: token
                    })
                    try {
                        return await db.driver.update({
                            where: {
                                id: foundUser.id
                            },
                            data: {
                                token: token
                            }
                        })
                    } catch (error) {
                        throw new Error(error)
                    }
                }
            } catch(err){
                throw new Error(err)
            }
        }
    }
}