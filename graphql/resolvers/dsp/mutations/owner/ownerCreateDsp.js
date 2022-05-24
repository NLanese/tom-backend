import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"

export default {
    Mutation: {
        ownerCreateDsp: async (_, {
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
            allDriverShifts,
        }, context) => {

            const owner = await checkOwnerAuth(token)

            const foundOwner = await db.owner.findUnique({
                where: {
                    id: owner.id
                },
                include: {
                    drivers: true,
                    managers: true
                }
            })

            if (!foundOwner) {
                throw new Error('Owner does not exist')
            }

            name = await name.toUpperCase()
            shortcode = await shortcode.toUpperCase()

            const justOwnerRecord = await db.owner.findUnique({
                where: {
                    id: owner.id
                }
            })

            if (!justOwnerRecord) {
                throw new Error('Owner does not exist')
            }

            try {
                let guestArray = []
                let managementArray = []

                await guestArray.push(justOwnerRecord)

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
                        deliveryNotRecievedLimits: deliveryNotRecievedLimits,
                        photoOnDeliveryLimits: photoOnDeliveryLimits,
                        topCardLimits: topCardLimits,
                        smallCardLimits: smallCardLimits,
                        feedbackNotifications: feedbackNotifications,
                        autoSend: autoSend,
                        allDriverShifts: allDriverShifts,
                    }
                })

                if (!newDsp) {
                    throw new Error('Error creating Dsp')
                }

                await foundOwner.managers.forEach( async (manager) => {
                    await guestArray.push(manager)

                    const foundManager = await db.manager.findUnique({
                        where: {
                            id: manager.id
                        }
                    })

                    if (foundManager) {
                        await db.dsp.update({
                            where: {
                                id: newDsp.id
                            },
                            data: {
                                managers: {
                                    connect: {
                                        id: manager.id
                                    }
                                }
                            }
                        })
                    }
                })

                await foundOwner.drivers.forEach( async (driver) => {
                    await guestArray.push(driver)

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

                const dspChatroom = await db.chatroom.create({
                    data: {
                        guests: [ ...guestArray ],
                        chatroomOwner: justOwnerRecord,
                        chatroomName: `${newDsp.name} Announcements`,
                        driverJoinOnSignUp: true,
                        announcementChat: true,
                        owner: {
                            connect: {
                                id: foundOwner.id
                            }
                        }
                    }
                })

                await guestArray.forEach( async (guest) => {
                    if (guest.role === "MANAGER") {
                        await db.chatroom.update({
                            where: {
                                id: dspChatroom.id
                            },
                            data: {
                                managers: {
                                    connect: {
                                        id: guest.id
                                    }
                                }
                            }
                        })
                    }

                    if (guest.role === "DRIVER") {
                        await db.chatroom.update({
                            where: {
                                id: dspChatroom.id
                            },
                            data: {
                                drivers: {
                                    connect: {
                                        id: guest.id
                                    }
                                }
                            }
                        })
                    }
                })

                await foundOwner.managers.forEach( async (manager) => {
                    await managementArray.push(manager)
                })

                const managementChatroom = await db.chatroom.create({
                    data: {
                        guests: [ ...managementArray, justOwnerRecord ],
                        chatroomOwner: justOwnerRecord,
                        chatroomName: `${newDsp.name} management chatroom`,
                        owner: {
                            connect: {
                                id: foundOwner.id
                            }
                        }
                    }
                })

                await managementArray.forEach( async (manager) => {
                    await db.chatroom.update({
                        where: {
                            id: managementChatroom.id
                        },
                        data: {
                            managers: {
                                connect: {
                                    id: manager.id
                                }
                            }
                        }
                    })
                })
                return newDsp
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}