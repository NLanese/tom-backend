import db from "../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Query :{
        dynamicGetDeviceByType: async (_, { role, token }, context) => {
            let user
            if (role == "MANAGER"){
               user = checkManagerAuth(token)
            }
            else{
               user = checkOwnerAuth(token)
            }

            try {
                return await db.device.findMany({
                    where: {
                        dspId: user.dsp.id
                    }
                })
            }catch(err){
                console.log(err)
                throw new Error(err)
            }
        }
    }
}