import db from "../../../../utils/generatePrisma.js";
import hashPassword from "../../../../utils/passwordHashing.js";
import { UserInputError } from "apollo-server-errors";
import { validateRegisterInput } from "../../../../utils/validators.js";

export default {
    Mutation: {
        ownerSignUp: async (_, {
            email,
            password,
            firstname,
            lastname,
            phoneNumber
        }, context) => {
            const { valid, errors } = validateRegisterInput(email, password)

            if (!valid) {
                throw new UserInputError('Errors', {
                    errors
                })
            }

            email = await email.toUpperCase()
            firstname = await firstname.toUpperCase()
            lastname = await lastname.toUpperCase()

            const owner = await db.owner.findUnique({
                where: {
                    email
                }
            })

            if (owner) {
                throw new UserInputError('email is taken', {
                    errors: {
                        email: 'Email is already taken',
                    },
                });
            }

            password = await hashPassword(password)

            try {
                return await db.owner.create({
                    data: {
                        email: email,
                        password: password,
                        firstname: firstname,
                        lastname: lastname,
                        phoneNumber: phoneNumber
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}