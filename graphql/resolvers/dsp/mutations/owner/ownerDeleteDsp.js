import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"

// USED FOR TESTING
export default {
    Mutation: {
        ownerDeleteDsp: async (_, {
            dspId
        }, context) => {
            const owner = await checkOwnerAuth(context)

            try {
                return await db.dsp.delete({
                    where: {
                        id: dspId
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}