import db from "../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";
import hashPassword from "../../../../utils/passwordHashing.js";

export default {
    Mutation: {
        dynamicResetPassword: async (_, {
            password, 
            token
        }, context) => {

            let user

            let foundOwner
            let foundManager

            try{ 
                foundOwner = await db.owner.findFirst({
                    where: {
                        resetPasswordToken: token
                    }
                })
            } catch (err){
                console.log(err)
            }
            try{ 
                foundManager = await db.manager.findFirst({
                    where: {
                        resetPasswordToken: token
                    }
                })
            } catch (err){
                console.log(err)
            }

            if (!foundManager && !foundOwner){
                throw new Error("There is no account with this code")
            }
            else if (foundManager){
                if (Date.now().toString() >= foundManager.resetPasswordTokenExpiration) {
                    throw new Error('Token is expired')
                }
                password = await hashPassword(password)
                try {
                    await db.manager.update({
                        where: {
                            id: foundManager.id
                        },
                        data: {
                            password: password
                        }
                    })
                    return ("Password Reset")
                } catch (error) {
                    throw new Error(error)
                }
            }
            else if (foundOwner){
                console.log(Date.now())
                console.log(foundOwner.resetPasswordTokenExpiration)
                if (Date.now().toString() >= foundOwner.resetPasswordTokenExpiration) {
                    throw new Error('Token is expired')
                }
                password = await hashPassword(password)
                try {
                    await db.owner.update({
                        where: {
                            id: foundOwner.id
                        },
                        data: {
                            password: password
                        }
                    })
                    return ("Password Reset")
                } catch (error) {
                    throw new Error(error)
                }
            }

        } 

       
    }
}