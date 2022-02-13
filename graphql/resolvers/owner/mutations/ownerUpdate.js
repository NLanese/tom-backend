import db from "../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";

export default {
    Mutation: {
        ownerUpdate: async (_, {
            email,
            password,
            firstname,
            lastname,
            phoneNumber
        }, context) => {
            const owner = await checkOwnerAuth(context)

            if (!owner) {
                errors.general = 'Owner not found';
                throw new UserInputError('Owner not found', {
                    errors
                });
            }

            if (email) {
                const foundOwner = await db.owner.findUnique({
                    where: {
                        email: email
                    }
                })
    
                const foundManager = await db.manager.findUnique({
                    where: {
                        email: email
                    }
                })
    
                if (foundOwner || foundManager) {
                    throw new Error("Email is already in use")
                }
            }

            if (typeof password !== "undefined") {
                password = await hashPassword(password)
            }

            if (email) {
                email = email.toUpperCase()
            }

            if (firstname) {
                firstname = firstname.toUpperCase()
            }

            if (lastname) {
                lastname = lastname.toUpperCase()
            }

            try {
                return await db.owner.update({
                    where: {
                        id: owner.id
                    },
                    data: {
                        email: email,
                        firstname: firstname,
                        lastname: lastname,
                        password: password,
                        phoneNumber: phoneNumber
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}