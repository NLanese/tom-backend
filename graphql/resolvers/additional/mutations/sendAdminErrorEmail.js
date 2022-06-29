import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js"
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js"
import db from "../../../../utils/generatePrisma.js"

export default {
    Mutation: {
        sendAdminErrorEmail: async (_, {errorCode, token, role}) => {

            let user 

            if (role === "OWNER"){
                user = await checkOwnerAuth(token)
                user = await db.owner.findUnique({
                    where: {
                        id: user.id
                    }
                })
            }
            else if (role === "MANAGER"){
                user = await checkManagerAuth(token)
                user = await db.manager.findUnique({
                    where: {
                        id: user.id 
                    }
                })
            }
            

            // Creates the means of sending the email
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                  user: `${process.env.EMAIL_ADDRESS}`,
                  pass: `${process.env.EMAIL_PASSWORD}`
                }
            })

            // Configures the actual Email Content
            const mailOptions = {
                from: `${process.env.EMAIL_ADDRESS}`,
                to: `nick@kingwillystudios.com`,
                subject: `TOM User Experienced ${errorCode} Error`,
                text: `User ${user.firstname} ${user.lastname} experienced a(n) ${errorCode} error. Please look into this.`
              }

            // SENDS the email through the transporter
            transporter.sendMail(mailOptions, (error, response) => {
                if (error){
                  throw new Error('Something went wrong, please try again \n' + error)
                } 
                else{
                    return "Email sent to Admin"
                }
            })
        }
    }
}