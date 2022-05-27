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
            sentAt,
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
            // photoOnDelivery,
            // attendedDeliveryAccuracy,
            customerDeliveryFeedback,
            dnr,
            podOpps,
            ccOpps
        }, context) => {
            let owner;
            let manager;

            //////////////////////
            //    Ownership     //
            ////////////////////// 

            if (role === 'OWNER') {
                owner = await checkOwnerAuth(token)
            }

            if (role === 'MANAGER') {
                manager = await checkManagerAuth(token)
            }
 
            //////////////////////
            //      Driver      //
            ////////////////////// 

            let dspTransporter = `${dspId}${transporterId}`
            let foundDriver = false 

            try {
                foundDriver = await db.driver.findFirst({
                    where: {
                        transporterId: transporterId
                    },
                    include: {
                        weeklyReport: true
                    }
                })
            }
            catch(err){
                console.log("No driver found error")
                throw new Error(`Driver with transporter Id ${transporterId} does not exist!`)
            }
            
            
            if (!foundDriver) {
                throw new Error(`Driver with transporter Id ${transporterId} does not exist!`)
            }
            else{
                console.log(foundDriver)
            }

            try {
                await db.weeklyReport.create({
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
                        // photoOnDelivery: photoOnDelivery,
                        // attendedDeliveryAccuracy: attendedDeliveryAccuracy,
                        customerDeliveryFeedback: customerDeliveryFeedback,

                        dnr: dnr,
                        podOpps: podOpps,
                        ccOpps: ccOpps,
                        driver: {
                            connect: {
                                id: foundDriver.id
                            }
                        },
                        dsp: {
                            connect: {
                                id: dspId
                            }
                        }
                    }
                })
            } catch (error) {
                console.log("scorecard failed for ", foundDriver.firstname)
                throw new Error(error)
            }

            if (feedbackMessageSent){
                try{
                    return await db.notifiedMessages.create({
                        data: {
                            date: date,
                            sentAt: sentAt,
                            createdAt: `${sentAt} - ${date}`,
                            readAt: "Not Read",
                            content: feedbackMessage,
                            from: "Automatic Scorecard Feedback",
                            type: `${feedbackStatus} Notification`,
                            driver: {
                                connect: {
                                    dspTransporter: dspTransporter
                                }
                            }
                        }
                    }).then( async (notiMsg) => {
                        try{
                            return await db.driver.update({
                                where: {
                                    dspTransporter: dspTransporter
                                },
                                data: {
                                    notifiedMessages: {
                                        connect: {
                                            id: notiMsg.id
                                        }
                                    }
                                },
                                include: {
                                    weeklyReport: true
                                }
                            }).then( resolved => {
                                console.log(resolved)
                                return resolved
                            })
                        } catch(err){
                            console.log("Error updating ", foundDriver.firstname )
                        }
                    })
                } catch(err){
                    console.log(err)
                }
            }

            else{

            }

            
        }
    }
}
