import crypto from ‘crypto’
import db from "../utils/generatePrisma.js"

const sendForgotPasswordEmail = (userEmail) => {

    // Sets up constants
    require('dotenv').config()
    const nodemailer = require('nodemailer')
    const token = crypto.randomBytes(integer).toString('hex')

    // Sets User's Password Token and Expiration Timer
    await db.user.update({
        where: {
            email: userEmail
        },
        data: {
            resetPasswordToken: token,
            resetPasswordTokenExpiration: Date.now() + 900 // That's fifiteen minutes
        }
    })

    // Creates the transporter and email object
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: `${process.env.EMAIL_ADDRESS}`,
            password: `${process.env.EMAIL_PASSWORD}`
        }
    })
    const mailOptions ={
        from: 'PUT_EMAIL_HERE',
        to: `${userEmail}`,
        subject: "Reset Your Password",
        text: `The code to reset your email is: ${token}` 
    }


    // Sends Email
    transporter.sendMail(mailOptions, (error, response) => {
        if (error){
            throw new Error("Something went wrong!\n" + error)
        } else {
            response.status(200).json("Recover Email Sent")
        }
    })
}

export default sendForgotPasswordEmail