import db from "../../../../utils/generatePrisma.js";
import nodemailer from 'nodemailer'
import sendinBlue from 'nodemailer-sendinblue'
import SibApiV3Sdk from 'sib-api-v3-sdk'
import hashPassword from "../../../../utils/passwordHashing.js";
import { UserInputError } from "apollo-server-errors";
import { validateRegisterInput } from "../../../../utils/validators.js";
import tokenGenerator from "../../../../utils/tokenGenerator.js"
import generateOwnerToken from "../../../../utils/generateToken/generateOwnerToken.js"


export default {
    Mutation: {
        ownerSignUp: async (_, {
            email,
            password,
            firstname,
            lastname,
            phoneNumber
        }, { req }) => {
            const { valid, errors } = validateRegisterInput(email, password)

            // Checks Validity of Input Fields
            if (!valid) {
                throw new UserInputError('Errors', {
                    errors
                })
            }

            // CAPS everything. No cap.
            let actualEmail = email
            email = await email.toUpperCase()
            firstname = await firstname.toUpperCase()
            lastname = await lastname.toUpperCase()

            // Finds Conflicting Owners
            const foundOwner = await db.owner.findUnique({
                where: {
                    email
                }
            })

            // Finds Conflicting Managers
            const foundManager = await db.manager.findUnique({
                where: {
                    email
                }
            })

            // Throws error if conflicts
            if (foundOwner || foundManager) {
                throw new UserInputError('Email is already in use', {
                    errors: {
                        email: 'Email is already in use',
                    },
                });
            }

            // Salts the password
            password = await hashPassword(password)
            const signUpToken = await tokenGenerator(10)

////////////////////////////////
///                          ///
///       EMAIL STUFF        ///
///                          ///
////////////////////////////////

        try{
            // Creates the Transporter
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: `${process.env.EMAIL_ADDRESS}`,
                    pass: `${process.env.EMAIL_PASSWORD}`
                }
            })

            // Creates the Mail Object
            const mailOptions = {
                from: `${process.env.EMAIL_ADDRESS}`,
                to: `${actualEmail}`,
                subject: `Thank you for joining the TOM Team!`,
                text: `We have recieved your Account Signup and are please to welcome you to the TOM Experience!`
                }
            
            // Sends the mail
            transporter.sendMail(mailOptions, (error, response) => {
                if (error){
                    throw new Error('Something went wrong, please try again \n' + error)
                } 
            })
        } catch(error){
            console.log(error)
        }
    
    


////////////////////////////////
///                          ///
///       MUTATION STUFF     ///
///                          ///
////////////////////////////////

            try {
                const newOwner = await db.owner.create({
                    data: {
                        email: email,
                        password: password,
                        firstname: firstname,
                        lastname: lastname,
                        phoneNumber: phoneNumber,
                        signUpToken: signUpToken,
                        subscriptionToken: "Free",
                        subscriptionStartDate: "Free-Version",
                        subscriptionEndDate: "Free-Version"
                    }
                })

                const token = await generateOwnerToken(newOwner.id)
                const ownerId = newOwner.id

                // return await {
                //     ...newOwner,
                //     token: token
                // }
                return await db.owner.update({
                    where: {
                        id: ownerId
                    },
                    data: {
                        email: email,
                        password: password,
                        firstname: firstname,
                        lastname: lastname,
                        phoneNumber: phoneNumber,
                        signUpToken: signUpToken,
                        profilePick: 'Default',
                        token: token,
                    }
                })
            } catch (error) {
                console.log(error)
                throw new Error(error)
            }
        }
    }
}