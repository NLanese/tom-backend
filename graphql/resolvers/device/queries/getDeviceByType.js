import db from "../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Query :{
        dynamicGetDeviceByType: async (_, { role, token, type }, context) => {
            if (role == "MANAGER"){
                checkManagerAuth(token)
            }
            else{
                checkOwnerAuth(token)
            }

            return await db.device.findMany({
                where: {
                    type: type
                }
            })
        }
    }
}