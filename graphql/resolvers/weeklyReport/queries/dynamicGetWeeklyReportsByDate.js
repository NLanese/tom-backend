import db from "../../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-admin-auth.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js";

export default {
    Query: {
        dynamicGetWeeklyReportsByDate: async (_, {
            date
        }, context) => {
            let owner;
            let manager;

            if (role === 'OWNER') {
                owner = await checkOwnerAuth(context)
            }

            if (role === 'MANAGER') {
                manager = await checkManagerAuth(context)
            }

            if (owner) {
                const foundOwner = await db.owner.findMany({
                    where: {
                        id: owner.id
                    }
                })

                console.log(foundOwner)

                try {
                 
                } catch (error) {
                    throw new Error(error)
                }
            }
        }
    }
}