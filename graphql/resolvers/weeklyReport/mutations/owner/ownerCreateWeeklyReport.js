import db from "../../../../../utils/generatePrisma.js"
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"

export default {
    Mutation: {
        ownerCreateWeeklyReport: async (_, {
            driverId,
            date,
            feedbackMessage,
            feedbackStatus,
            acknowledgedAt,
            rank,
            tier,
            delivered,
            keyFocusArea,
            fico,
            seatbeltOffRate,
            speedingEventRate,
            distractionsRate,
            followingDistanceRate,
            signalViolationsRate,
            deliveryCompletionRate,
            deliveredAndRecieved,
            photoOnDelivery,
            attendedDeliveryAccuracy,
            dnr,
            podOpps,
            ccOpps
        }, context) => {
            const owner = await checkOwnerAuth(context)

            try {
                return await db.weeklyReport.create({
                    data: {
                        driver: {
                            connect: {
                                id: driverId
                            }
                        },
                        date: date,
                        feedbackMessage: feedbackMessage,
                        feedbackStatus: feedbackStatus,
                        acknowledgedAt: acknowledgedAt,
                        rank: rank,
                        tier: tier,
                        delivered: delivered,
                        keyFocusArea: keyFocusArea,
                        fico: fico,
                        seatbeltOffRate: seatbeltOffRate,
                        speedingEventRate: speedingEventRate,
                        distractionsRate: distractionsRate,
                        followingDistanceRate: followingDistanceRate,
                        signalViolationsRate: signalViolationsRate,
                        deliveryCompletionRate: deliveryCompletionRate,
                        deliveredAndRecieved: deliveredAndRecieved,
                        photoOnDelivery: photoOnDelivery,
                        attendedDeliveryAccuracy: attendedDeliveryAccuracy,
                        dnr: dnr,
                        podOpps: podOpps,
                        ccOpps, ccOpps
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}