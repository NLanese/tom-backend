import db from "../../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";

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
            deliveryNotRecievedLimits,
            photoOnDeliveryLimits,
            topCardLimits,
            smallCardLimits,
            feedbackNotifications,
            autoSend
        }, context) => {
            const manager = await checkManagerAuth(context)

            const foundManager = await db.manager.findUnique({
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

            const dspCheck = await db.dsp.findUnique({
                where: {
                    id: foundManager.dsp.id
                }
            })

            if (!dspCheck) {
                throw new Error('DSP does not exist')
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
                        deliveryNotRecievedLimits: deliveryNotRecievedLimits,
                        photoOnDeliveryLimits: photoOnDeliveryLimits,
                        topCardLimits: topCardLimits,
                        smallCardLimits: smallCardLimits,
                        feedbackNotifications: feedbackNotifications,
                        autoSend: autoSend
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}