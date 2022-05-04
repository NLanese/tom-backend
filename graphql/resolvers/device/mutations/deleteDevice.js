import db from "../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";

// USED FOR TESTING
export default {
    Mutation: {
        deleteDevice: async (_, {
            token,
            role,
            id,

        }, context) => {
            let owner = false
            let manager = false

            if (role === "OWNER"){
                owner = checkOwnerAuth(token)
            }
            else if(role === "MANAGER"){
                manager = checkManagerAuth(token)
            }
            else {
                throw new Error("No Access! Nice Try, noob")
            }

            // Determines if Valid 
            if (!manager && !owner){
                throw new Error("No owner or manager with the give crudentials found")
            }


            try {
                return await db.device.delete({
                    where: {
                        id: id
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}