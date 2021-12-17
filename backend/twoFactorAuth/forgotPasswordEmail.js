import crypto from "crypto"
import db from "../utils/generatePrisma.js"
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

const sendForgotPasswordEmail = async (userEmail) => {
    // Sets up constants
    dotenv.config()
    const token = crypto.randomBytes(8).toString('hex')

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
            pass: `${process.env.EMAIL_PASSWORD}`
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