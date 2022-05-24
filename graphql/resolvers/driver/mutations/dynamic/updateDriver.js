import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js";
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import hashPassword from "../../../../../utils/passwordHashing.js";

export default {
    Mutation: {
        dynamicUpdateDriver: async (_, {
            role,
            token,
            driverId,
            email,
            firstname,
            lastname,
            password,
            phoneNumber,
            dspId,
            transporterId,
        }, context) => {
            let owner;
            let manager;

            // Dynamic authorization check
            if (role === 'OWNER') owner = await checkOwnerAuth(token)
            if (role === 'MANAGER') manager = await checkManagerAuth(token)

            // Check and change data / hash password
            if (typeof password !== "undefined") password = await hashPassword(password)
			if (email) email = email.toUpperCase()
			if (firstname) firstname = firstname.toUpperCase()
			if (lastname) lastname = lastname.toUpperCase()

            let dspTransporter = `${dspId}${transporterId}`

            const foundDriver = await db.driver.findUnique({
                where: {
                    id: driverId
                }
            })

            if (!foundDriver) throw new Error("Driver does not exist")

            if (email) {
                const emailCheck = await db.driver.findFirst({
                    where: {
                        email: email
                    }
                })
    
                if (emailCheck && emailCheck.id != driverId) {
                    throw new Error("Email is already in use")
                }
            }

            if (owner || manager) {
                try {
                    return await db.driver.update({
                        where: {
                            id: driverId
                        },
                        data: {
                            email: email,
                            firstname: firstname,
                            lastname: lastname,
                            phoneNumber: phoneNumber,
                            password: password
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }
        } 
    }
}