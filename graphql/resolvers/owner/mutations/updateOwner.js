import db from "../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";

export default {
    Mutation: {
        updateOwner: async (_, {
            email,
            password,
            firstname,
            lastname,
            phoneNumber
        }, context) => {
            const owner = await checkOwnerAuth(context)

            if (!owner) {
                errors.general = 'Driver not found';
                throw new UserInputError('Driver not found', {
                    errors
                });
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