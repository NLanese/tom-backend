import db from "../../../../../utils/generatePrisma.js";
import checkAdminAuth from "../../../../../utils/checkAuthorization/check-admin-auth.js";

export default {
    Mutation: {
        managerUpdateDsp: async (_, {
            ficoLimits,
            seatbeltLimits,
            speedingLimits,
            distractionLimits,
            followLimits,
            signalLimits,
            deliveryCompletionRateLimits,
            scanComplianceLimits,
            callComplianceLimits,
            deliveryNotRecievedLimits,
            photoOnDeliveryLimits,
            topCardLimits,
            smallCardLimits
        }, context) => {
            const manager = await checkAdminAuth(context)

            const foundManager = await db.admin.findUnique({
                where: {
                    id: manager.id
                },
                include: {
                    dsp: true
                }
            })

            if (!foundManager) {
                throw new Error('Manager does not exist')
            }

            try {
                return await db.dsp.update({
                    where: {
                        id: foundManager.dsp.id
                    },
                    data: {
                        ficoLimits: ficoLimits,
                        seatbeltLimits: seatbeltLimits,
                        speedingLimits: speedingLimits,
                        distractionLimits: distractionLimits,
                        followLimits: followLimits,
                        signalLimits: signalLimits,
                        deliveryCompletionRateLimits: deliveryCompletionRateLimits,
                        scanComplianceLimits: scanComplianceLimits,
                        callComplianceLimits: callComplianceLimits,
                        deliveryNotRecievedLimits: deliveryNotRecievedLimits,
                        photoOnDeliveryLimits: photoOnDeliveryLimits,
                        topCardLimits: topCardLimits,
                        smallCardLimits: smallCardLimits
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}