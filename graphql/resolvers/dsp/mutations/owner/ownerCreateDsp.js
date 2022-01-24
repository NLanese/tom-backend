import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"

export default {
    Mutation: {
        ownerCreateDsp: async (_, {
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
            smallCardLimits,
            feedbackNotifications,
            autoSend
        }, context) => {
            const owner = await checkOwnerAuth(context)

            const foundOwner = await db.owner.findUnique({
                where: {
                    id: owner.id
                },
                include: {
                    drivers: true,
                    admins: true
                }
            })

            if (!foundOwner) {
                throw new Error('Owner does not exist')
            }

            name = await name.toUpperCase()
            shortcode = await shortcode.toUpperCase()

            try {
                const newDsp = await db.dsp.create({
                    data: {
                        owner: {
                            connect: {
                                id: owner.id
                            }
                        },
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
                        smallCardLimits: smallCardLimits,
                        feedbackNotifications: feedbackNotifications,
                        autoSend: autoSend
                    }
                })

                foundOwner.admins.forEach( async (admin) => {
                    const foundAdmin = await db.admin.findUnique({
                        where: {
                            id: admin.id
                        }
                    })

                    if (foundAdmin) {
                        await db.dsp.update({
                            where: {
                                id: newDsp.id
                            },
                            data: {
                                admins: {
                                    connect: {
                                        id: admin.id
                                    }
                                }
                            }
                        })
                    }
                })

                foundOwner.drivers.forEach( async (driver) => {
                    const foundDriver = await db.driver.findUnique({
                        where: {
                            id: driver.id
                        }
                    })

                    if (foundDriver) {
                        await db.dsp.update({
                            where: {
                                id: newDsp.id
                            },
                            data: {
                                drivers: {
                                    connect: {
                                        id: driver.id
                                    }
                                }
                            }
                        })
                    }
                })

                return newDsp
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}