import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js";

export default {
    Mutation: {
        ownerUpdateDsp: async (_, {
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
            scanComplianceLimits,
            callComplianceLimits,
            deliveryNotRecievedLimits,
            photoOnDeliveryLimits,
            topCardLimits,
            smallCardLimits
        }, context) => {
            const owner = await checkOwnerAuth(context)

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