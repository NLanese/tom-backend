import db from "../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth.js";
import hashPassword from "../../../../utils/passwordHashing.js";

export default {
    Mutation:{
        driverUpdate: async (_, {
            email,
            firstname,
            lastname,
            password,
            phoneNumber
        }, context) => {
            const driver = await checkDriverAuth(context)
    
            if (typeof password !== "undefined") {
                password = await hashPassword(password)
            }
    
            if (email) {
                email = email.toUpperCase()
    
                const foundDriver = await db.driver.findUnique({
                    where: {
                        email
                    }
                })
    
                if (foundDriver) {
                    throw new Error('Email is already in use')
                }
            }
    
    
            if (firstname) {
                firstname = firstname.toUpperCase()
            }
    
            if (lastname) {
                lastname = lastname.toUpperCase()
            }
    
            try {
                const newUser = await db.driver.update({
                    where: {
                        id: driver.id
                    },
                    data: {
                        email: email,
                        firstname: firstname,
                        lastname: lastname,
                        phoneNumber: phoneNumber,
                        password: password
                    }
                });
    
                return newUser;
    
            } catch (error) {
                throw new Error(error);
            }
        }
    }
}