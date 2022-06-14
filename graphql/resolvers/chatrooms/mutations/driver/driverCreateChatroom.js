import db from "../../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js"

export default {
    Mutation: {
        driverCreateChatroom: async (_, {
            guests,
            chatroomName
        }, context) => {
            const driver = await checkDriverAuth(context)

            try {
                const justDriverRecord = await db.driver.findUnique({
                    where: {
                        id: driver.id
                    }
                })

                if (!justDriverRecord) {
                    throw new Error('Driver does not exist')
                }
    
                await guests.push(justDriverRecord)

                const newChatroom = await db.chatroom.create({
                    data: {
                        guests: guests,
                        chatroomOwner: justDriverRecord,
                        chatroomName: chatroomName,
                        managerJoinOnSignUp: false,
                        mutedIds: [],
                        drivers: {
                            connect: {
                                id: driver.id
                            }
                        },
                    }
                })

                if (!newChatroom) {
                    throw new Error('Error creating chatroom')
                }

                await guests.forEach( async (guest) => {
                    if (guest.id !== driver.id) {
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

                        if (guest.role === "OWNER") {
                            await db.chatroom.update({
                                where: {
                                    id: newChatroom.id
                                },
                                data: {
                                    owner: {
                                        connect: {
                                            id: guest.id
                                        }
                                    }
                                } 
                            })
                        }
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
    }
}
