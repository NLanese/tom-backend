import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js";

export default {
    Mutation: {
        ownerUpdateDsp: async (_, {
            token,
            name,
            shortcode,
            timeZone,
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
            autoSend,
            allDevices,
        }, context) => {

            const owner = await checkOwnerAuth(token)

            const foundOwner = await db.owner.findUnique({
                where: {
                    id: owner.id
                },
                include: {
                    dsp: true
                }
            })

            if (!foundOwner) {
                throw new Error('Owner does not exist')
            }

            name = await name.toUpperCase()
            shortcode = await shortcode.toUpperCase()

            const foundDsp = await db.dsp.findUnique({
                where: {
                    id: foundOwner.dsp.id
                }
            })

            if (!foundDsp) {
                throw new Error('DSP does not exist')
            }

            try {
                return await db.dsp.update({
                    where: {
                        id: foundOwner.dsp.id
                    },
                    data: {
                        name: name,
                        shortcode: shortcode,
                        timeZone: timeZone,
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
                        autoSend: autoSend,
                        allDevices: allDevices
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}