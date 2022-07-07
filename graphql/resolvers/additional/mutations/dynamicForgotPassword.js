import db from "../../../../utils/generatePrisma.js";
import generateForgotPasswordToken from "../../../../utils/generateToken/generateForgotPasswordToken.js";
import nodemailer from 'nodemailer'
import getTodaysDate from "../../../../utils/DateAndTime/getTodaysDate.js";
import getCurrentTime from "../../../../utils/DateAndTime/getCurrentTime.js";
import addTime from "../../../../utils/DateAndTime/addTime.js";
import dateTimeToInt from "../../../../utils/DateAndTime/dateTimeToInt.js";


export default {
    Mutation: {
        dynamicForgotPassword: async (_, {email}, context) => {
                 
            ///////////////////////////
            ///                     ///
            ///     Finds  User     ///
            ///                     ///
            ///////////////////////////
            email = email.toUpperCase()

            let user
            let tableType

             // Finds the Owner using the given email
            const foundOwner = await db.owner.findUnique({
                where: {
                    email: email
                }
            })

            // If the email does not belong to an owner but rather a manager
            if (!foundOwner){
                const foundManager = await db.manager.findUnique({
                    where: {
                        email: email
                    }
                })
                user = foundManager
            }
            else{
                user = foundOwner
                tableType = "owner"
            }




            ///////////////////////////
            ///                     ///
            ///   Generates Token   ///
            ///                     ///
            ///////////////////////////       
            
            let rand
            let token

            // Generates resetToken
            try{
                rand = (x) => {
                    return ((Math.random() + Math.random() * 100).toString())
                };
                token = rand()
            }
            catch(error){
                console.log(error)
            }
            

            let conflictingToken = []
            let otherConflictingToken = false
            let thirdPotentialConflictingToken = false

            // Finds if any other driver has the same token somehow
            try{
                conflictingToken = await db.owner.findMany({
                    where: {
                        resetPasswordToken: token
                    }
                })
            }
            catch(err){
                console.log(err)
            }
            

            // Finds if a manager has the token
            try{
                otherConflictingToken = await db.manager.findFirst({
                    where: {
                        resetPasswordToken: token
                    }
                })
            }
            catch(err){
                console.log(err)
            }
            

            // Finds if a driver has the token
            try{
                thirdPotentialConflictingToken = await db.driver.findFirst({
                    where: {
                        resetPasswordToken: token
                    }
                })
            }
            catch(err){
                console.log(err)
            }
            

            // Generates a random string
            let randomizer = email + Math.random().toString() + user.id

            // Rerandomizes the token 
            if (conflictingToken.length > 1 || otherConflictingToken || thirdPotentialConflictingToken){
                token = generateForgotPasswordToken(generateForgotPasswordToken(randomizer))
            }

            let code = `https://dashboard.thetomapp.com/authentication/password-reset-key?key=${token}`




            ///////////////////////////
            ///                     ///
            /// Email Config / Send ///
            ///                     ///
            ///////////////////////////

            // Creates the means of sending the email
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                  user: `${process.env.EMAIL_ADDRESS}`,
                  pass: `${process.env.EMAIL_PASSWORD}`
                }
            })

            let today = getTodaysDate().date 
            let time = getCurrentTime().hourMin

            let fullDateTime = {date: today, time: time}
            let expire = addTime(30, fullDateTime)
            expire = dateTimeToInt(expire)


            // Configures the actual Email Content
            const mailOptions = {
                from: `${process.env.EMAIL_ADDRESS}`,
                to: `${email}`,
                subject: `Reset your TOM App Password`,
                text: `Please click the link provided to be sent to the Reset Password page: \n${code}`
            }

            // If all works, sends the email
            transporter.sendMail(mailOptions, (error, response) => {
                if (error){
                  throw new Error('Something went wrong, please try again \n' + error)
                } 
            })



            ///////////////////////////
            ///                     ///
            /// Email Config / Send ///
            ///                     ///
            ///////////////////////////


            if (user){
                console.log(token, "Token pre mutation")
                console.log(expire, "Expire int pre mutation")
                if (tableType === "owner"){
                    try{
                        await db.owner.update({
                            where: {
                                id: user.id
                            },
                            data: {
                                resetPasswordToken: token,
                                resetPasswordTokenExpiration: expire
                            }
                        }).then(resolved => {
                            console.log(token, "Token POST mutation")
                console.log(expire, "Expire int POST mutation")
                        })
                        return "Email Sent"
                    } catch (error){
                        console.log(error)
                        throw new Error(error)
                    }
                }
                else{
                    try{
                        await db.manager.update({
                            where: {
                                id: user.id
                            },
                            data: {
                                resetPasswordToken: token,
                                resetPasswordTokenExpiration: expire
                            }
                        })
                        return "Email Sent"
                    } catch (error){
                        throw new Error(error)
                    }
                }
                
            }
            else{
                throw new Error("Error: This email is not associated with any account")
            }
        }
    }
}