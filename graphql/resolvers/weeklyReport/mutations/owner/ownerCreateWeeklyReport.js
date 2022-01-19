import db from "../../../../../utils/generatePrisma.js"
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"

export default {
    Mutation: {
        ownerCreateWeeklyReport: async (_, {
            driverId,
            date,
            feedback,
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
            deliveryNotRecieved,
            photoOnDelivery,
            callCompliance,
            scanCompliance,
            attendedDeliveryAccuracy
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
                        feedback: feedback,
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
                        deliveredNotRecieved: deliveryNotRecieved,
                        photoOnDelivery: photoOnDelivery,
                        callCompliance: callCompliance,
                        scanCompliance: scanCompliance,
                        attendedDeliveryAccuracy: attendedDeliveryAccuracy
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}