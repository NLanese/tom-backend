import crypto from "crypto"
import db from "../../utils/generatePrisma.js"
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

const sendForgotPasswordEmail = async (driverId) => {
    // Sets up constants
    dotenv.config()
    const token = crypto.randomBytes(8).toString('hex')

    const driver = await db.driver.findUnique({
        where: {
            id: Number(driverId)
        }
    })

    if (!driver) {
        throw new Error("Error: Driver does not exist")
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
        service: 'gmail',
        auth: {
            driver: `${process.env.EMAIL_ADDRESS}`,
            pass: `${process.env.EMAIL_PASSWORD}`
        }
    })
    const mailOptions = {
        from: 'Tom-App Support',
        to: `${userEmail}`,
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