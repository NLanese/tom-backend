import crypto from 'crypto'
import db from "../../utils/generatePrisma.js"

const sendForgotPasswordText = (userNumber) => {

    // Sets up constants
    require('dotenv').config()
    const lib = require('messagemedia-messages-sdk')
    const token = crypto.randomBytes(32).toString('hex')

    // Sets User's Password Token and Expiration Timer
    await db.user.update({
        where: {
            phoneNumber: userNumber
        },
        data: {
            resetPasswordToken: token,
            resetPasswordTokenExpiration: Date.now() + 900 // That's fifiteen minutes
        }
    })

    let controller = lib.MessageController

    let body = new lib.SendMessagesRequest()

    body.messages = []

    body.messages[0].content = `Your code to reset your password is: ${token}` 
    body.messages[0].destinationNumber = `${userNumber}`

    controller.sendMEssage(body, (error, response, context) => {
        if (error){
            throw new Error(error)
        } else {
            console.log(response)
        }
    })

}
