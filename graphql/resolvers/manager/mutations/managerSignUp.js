import db from "../../../../utils/generatePrisma.js";
import hashPassword from "../../../../utils/passwordHashing.js";
import { UserInputError } from 'apollo-server-errors';
import { validateRegisterInput } from "../../../../utils/validators.js";

/* SIGNS UP THE MANAGER AND RELATES THEM TO THE OWNER */
export default {
    Mutation: {
        managerSignUp: async (_, {
            email,
            password,
            firstname,
            lastname,
            phoneNumber,
            ownerEmail
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
            ownerEmail = await ownerEmail.toUpperCase()

            const admin = await db.admin.findUnique({
                where: {
                    email
                },
            });

            if (admin) {
                throw new UserInputError('email is taken', {
                    errors: {
                        email: 'Email is already taken',
                    },
                });
            }

            password = await hashPassword(password)

            const owner = await db.owner.findUnique({
                where: {
                    email: ownerEmail
                }
            })

            if (!owner) {
                throw new Error('Owner does not exist')
            }

            try {
                return await db.admin.create({
                    data: {
                        owner: {
                            connect: {
                                id: owner.id
                            }
                        },
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