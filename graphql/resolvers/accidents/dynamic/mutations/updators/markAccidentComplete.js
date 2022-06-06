import db from "../../../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../../../utils/checkAuthorization/check-owner-auth.js";
import checkDriverAuth from "../../../../../../utils/checkAuthorization/check-driver-auth.js";


export default {
    Mutation: {
        markAccidentComplete: async (_, {accidentId}, context) => {

            const driver = checkDriverAuth(context)

            if (!driver){
                throw new error ("Invalid Driver Account. Please try again")
            }
            else{
                return await db.accident.update({
                    where: {
                        id: accidentId
                    },
                    data: {
                        filled: true
                    }
                })
            }
        }
    }
}