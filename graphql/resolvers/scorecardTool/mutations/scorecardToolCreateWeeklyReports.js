import db from "../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Mutation: {
        scorecardToolCreateWeeklyReports: async (_, {
            token,
            role,
            dspId,
            transporterId,
            date,
            feedbackStatus,
            feedbackMessage,
            feedbackMessageSent,
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
            let owner;
            let manager;


            if (role === 'OWNER') {
                owner = await checkOwnerAuth(token)
            }

            if (role === 'MANAGER') {
                manager = await checkManagerAuth(token)
            }

            const foundDriver = await db.driver.findFirst({
                where: {
                    transporterId,
                    dspId
                }
            })

            if (!foundDriver) {
                throw new Error('Driver does not exist')
            }

            try {
                return await db.weeklyReport.create({
                    data: {
                        driver: {
                            connect: {
                                id: foundDriver.id
                            }
                        },
                        date: date,
                        feedbackStatus: feedbackStatus,
                        feedbackMessage: feedbackMessage,
                        feedbackMessageSent: feedbackMessageSent,
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
                        ccOpps: ccOpps
                    }
                })
            } catch (error) {
                console.log("\n\n\n\nERROR creating weekly report. Here's why...")
                console.log(error)
                throw new Error(error)
            }
            
        }
    }
}