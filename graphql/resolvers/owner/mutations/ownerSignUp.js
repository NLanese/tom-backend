import db from "../../../../utils/generatePrisma.js";
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

            if (!valid) {
                throw new UserInputError('Errors', {
                    errors
                })
            }

            email = await email.toUpperCase()
            firstname = await firstname.toUpperCase()
            lastname = await lastname.toUpperCase()

            const foundOwner = await db.owner.findUnique({
                where: {
                    email
                }
            })

            const foundManager = await db.manager.findUnique({
                where: {
                    email
                }
            })

            if (foundOwner || foundManager) {
                throw new UserInputError('Email is already in use', {
                    errors: {
                        email: 'Email is already in use',
                    },
                });
            }

            password = await hashPassword(password)
            const signUpToken = await tokenGenerator(10)

            try {
                const newOwner = await db.owner.create({
                    data: {
                        email: email,
                        password: password,
                        firstname: firstname,
                        lastname: lastname,
                        phoneNumber: phoneNumber,
                        signUpToken: signUpToken
                    }
                })

                const token = await generateManagerToken(newOwner.id)
                const ownerId = newOwner.id

                req.session = {
                    token: `Bearer ${token}`
                }

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
                        token: token
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}