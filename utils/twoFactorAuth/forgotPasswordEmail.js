import crypto from "crypto"
import db from "../../utils/generatePrisma.js"
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

const sendForgotPasswordEmail = async (email) => {
    // Sets up constants
    dotenv.config()
    const token = crypto.randomBytes(8).toString('hex')

    email = email.toUpperCase()

    const driver = await db.driver.findUnique({
        where: {
            email: email
        }
    })

    if (!driver) {
        return
        // throw new Error("Error: Driver does not exist")
    }

    // Sets Driver's Password Token and Expiration Timer
    await db.driver.update({
        where: {
            email: driver.email
        },
        data: {
            resetPasswordToken: token,
            resetPasswordTokenExpiration: Date.now() + 300
        }
    })

    // Creates the transporter and email object
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: `${process.env.EMAIL_ADDRESS}`,
            pass: `${process.env.EMAIL_PASSWORD}`
        }
    })
    const mailOptions = {
        from: 'Tom-App Support',
        to: `${driver.email}`,
        subject: "Reset Your Password",
        text: `The code to reset your password is: ${token}. It will expire in 5 minutes`
    }


    // Sends Email
    transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
            throw new Error("Something went wrong!\n" + error)
        } else {
            response.status(200).json("Recover Email Sent")
        }
    })
}

export default sendForgotPasswordEmail