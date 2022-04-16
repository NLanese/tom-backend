import db from "../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Mutation: {
        scorecardToolCreateWeeklyReports: async (_, {
            token,
            dspId,
            role,
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

            console.log("\nBEGINNING CREATEWEEKLY \nHit One")

            if (role === 'OWNER') {
                owner = await checkOwnerAuth(token)
            }

            if (role === 'MANAGER') {
                manager = await checkManagerAuth(token)
            }

            console.log("Hit Two")

            let foundDriver = await db.driver.findFirst({
                where: {
                    transporterId: transporterId,
                    dspId: dspId
                }
            })
            
            console.log("Hit Three")

            let driverId 

            if (!foundDriver.id) {
                throw new Error('Driver does not exist')
            }

            driverId = foundDriver.id 

            console.log("Hit Four: driverID")
            console.log(driverId)

            console.log(dspId)

            try {
                return await db.weeklyReport.create({
                    data: {
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
                        ccOpps: ccOpps,
                        driver: {
                            connect: {
                                id: driverId
                            }
                        },
                        dsp: {
                            connect: {
                                id: dspId
                            }
                        }
                    }
                })
                // .then( async (weeklyReport) => {
                //     let weeklyReports = [...foundDriver.weeklyReport, weeklyReport]
                //     try {
                //         const thisDriver = await db.driver.update({
                //             where: {
                //                 id: driverId
                //             },
                //             data: {
                //                 weeklyReport: weeklyReports
                //             }
                //         })
                //         return await db.weeklyReport.update({
                //             where: {
                //                 id: weeklyReport.id
                //             },
                //             data: {
                //                 driver: {
                //                     connect: {
                //                         id: thisDriver.id
                //                     }
                //                 }
                //             }
                //         })
                //     } catch(error){
                //         throw new Error(error)
                //     }
                // })
            } catch (error) {
                console.log(error)
                throw new Error(error)
            }
            
        }
    }
}