import db from "../../../../utils/generatePrisma"

export default {
    Mutation: {
        sendNativeErrorEmail: async (_, {errorCode, userId}) => {
            const foundDriver = await db.driver.findUnique({
                where: {
                    id: id
                }
            })

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
                text: `User ${foundDriver.firstname} ${foundDriver.lastname} experienced a(n) ${errorCode} error. Please look into this.`
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