import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";

// STILL NEED TO TEST WITH ALL THE NEW UPDATE 
// HOWEVER I DONT THINK THIS IS NEEDED ANYMORE BECAUSE
// THE ROOM GETS CREATED ON DRIVER SIGN UP
export default {
    Mutation: {
        dynamicCreateDriverManagementChatroom: async (_, {
            role,
            driverId,
            chatroomName
        }, context) => {
            let owner;
            let manager;
            let guests = []

            // DYNAMIC AUTHORIZATION CHECK
            if (role === 'OWNER') owner = await checkOwnerAuth(context)
            if (role === 'MANAGER') manager = await checkManagerAuth(context)

            const foundDriver = await db.driver.findUnique({
                where: {
                    id: driverId
                }
            })

            if (!foundDriver) throw new Error("Driver does not exist")
            await guests.push(foundDriver)

            // OWNER MUTATION
            if (owner) {
                const foundOwner = await db.owner.findUnique({
                    where: {
                        id: owner.id
                    },
                    include: {
                        managers: true
                    }
                })

                if (!foundOwner) {
                    throw new Error('Owner does not exist')
                }

                const justOwnerRecord = await db.owner.findUnique({
                    where: {
                        id: owner.id
                    }
                })

                if (!justOwnerRecord) {
                    throw new Error('Owner does not exist')
                }

                await guests.push(justOwnerRecord)

                await foundOwner.managers.forEach((manager) => {
                    guests.push(manager)
                })

                try {
                    const newChatroom = await db.chatroom.create({
                        data: {
                            guests: guests,
                            chatroomOwner: justDriverRecord,
                            chatroomName: chatroomName,
                            managerJoinOnSignUp: false,
                            mutedIds: [],
                            owner: {
                                connect: {
                                    id: owner.id
                                }
                            }
                        }
                    })

                    if (!newChatroom) {
                        throw new Error('Error creating chatroom')
                    }

                    await guests.forEach( async (guest) => {
                        if (guest.role === "DRIVER") {
                            await db.chatroom.update({
                                where: {
                                    id: newChatroom.id
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

                        if (guest.role === "MANAGER") {
                            await db.chatroom.update({
                                where: {
                                    id: newChatroom.id
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
                    })

                    return await db.chatroom.findUnique({
                        where: {
                            id: newChatroom.id
                        },
                        include: {
                            owner: true,
                            managers: true,
                            drivers: true
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }

            // MANAGER MUTATION
            if (manager) {
                const foundManager = await db.manager.findUnique({
                    where: {
                        id: manager.id
                    } 
                })

                if (!foundManager) {
                    throw new Error('Manager does not exist')
                }

                const foundOwner = await db.owner.findUnique({
                    where: {
                        id: foundManager.ownerId
                    },
                    include: {
                        managers: true
                    }
                })

                if (!foundOwner) {
                    throw new Error('Owner does not exist')
                }

                await foundOwner.managers.forEach((manager) => {
                    guests.push(manager)
                })

                const justOwnerRecord = await db.owner.findUnique({
                    where: {
                        id: foundManager.ownerId
                    }
                })

                await guests.push(justOwnerRecord)

                try {
                    const newChatroom = await db.chatroom.create({
                        data: {
                            guests: guests,
                            chatroomOwner: justDriverRecord,
                            chatroomName: chatroomName,
                            managerJoinOnSignUp: false,
                            mutedIds: [],
                            owner: {
                                connect: {
                                    id: foundOwner.id
                                }
                            }
                        }
                    })

                    if (!chatroom) {
                        throw new Error("Error creating chatroom")
                    }

                    await guests.forEach( async (guest) => {
                        if (guest.role === "DRIVER") {
                            await db.chatroom.update({
                                where: {
                                    id: newChatroom.id
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

                        if (guest.role === "MANAGER") {
                            await db.chatroom.update({
                                where: {
                                    id: newChatroom.id
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
                    })

                    return await db.chatroom.findUnique({
                        where: {
                            id: newChatroom.id
                        },
                        include: {
                            owner: true,
                            managers: true,
                            drivers: true
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }

            throw new Error("Something went wrong. Please try again")
        }
    }
}