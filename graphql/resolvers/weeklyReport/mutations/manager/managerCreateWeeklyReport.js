import db from "../../../../../utils/generatePrisma.js"
import checkAdminAuth from "../../../../../utils/checkAuthorization/check-admin-auth.js"

export default {
    Mutation: {
        managerCreateWeeklyReport: async (_, {
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
            deliveryNotRecieved,
            photoOnDelivery,
            callCompliance,
            scanCompliance,
            attendedDeliveryAccuracy
        }, context) => {
            const manager = await checkAdminAuth(context)

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