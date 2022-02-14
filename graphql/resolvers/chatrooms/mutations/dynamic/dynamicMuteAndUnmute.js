import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Mutation: {
        dynamicMuteAndUnmute: async (_, {
            role,
            driverId,
            managerId
        }, context) => {
            let owner;
            let manager;
           
            // DYNAMIC AUTHORIZATION CHECK
            if (role === 'OWNER') owner = await checkOwnerAuth(context)
            if (role === 'MANAGER') manager = await checkManagerAuth(context)

            if (owner && driverId || manager && driverId) {
                const foundDriver = await db.driver.findUnique({
                    where: {
                        id: driverId
                    }
                })
    
                if (!foundDriver) throw new Error('Driver does not exist')

                return await db.driver.update({
                    where: {
                        id: foundDriver.id
                    },
                    data: {
                        muted: !foundDriver.muted
                    }
                })
            }

            if (owner && managerId) {
                const foundManager = await db.manager.findUnique({
                    where: {
                        id: managerId
                    }
                })
    
                if (!foundManager) throw new Error('Manager does not exist')

                return await db.manager.update({
                    where: {
                        id: foundManager.id
                    },
                    data: {
                        muted: !foundManager.muted
                    }
                })
            }

            throw new Error('Something went wrong. Please try again')
        }
    }
}