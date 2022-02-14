import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Mutation: {
        dynamicCreateChatroom: async (_, {
            role,
            guests,
            chatroomName
        }, context) => {
            let owner;
            let manager;

            // DYNAMIC AUTHORIZATION CHECK
            if (role === 'OWNER') owner = await checkOwnerAuth(context)
            if (role === 'MANAGER') manager = await checkManagerAuth(context)

            if (owner) {
                try {
                    const justOwnerRecord = await db.owner.findUnique({
                        where: {
                            id: owner.id
                        }
                    })

                    if (!justOwnerRecord) {
                        throw new Error('Owner does not exist')
                    }
    
                    await guests.push(justOwnerRecord)
    
                    const newChatroom = await db.chatroom.create({
                        data: {
                            guests: guests,
                            chatroomOwner: justOwnerRecord,
                            chatroomName: chatroomName,
                            managerJoinOnSignUp: false,
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
                        if (guest.id !== owner.id) {
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

            if (manager) {
                try {
                    const justManagerRecord = await db.manager.findUnique({
                        where: {
                            id: manager.id
                        }
                    })

                    if (!justManagerRecord) {
                        throw new Error('Manager does not exist')
                    }

                    await guests.push(justManagerRecord)
    
                    const newChatroom = await db.chatroom.create({
                        data: {
                            guests: guests,
                            chatroomOwner: justManagerRecord,
                            chatroomName: chatroomName,
                            managerJoinOnSignUp: false,
                            managers: {
                                connect: {
                                    id: manager.id
                                }
                            }
                        }
                    })

                    if (!newChatroom) {
                        throw new Error('Error creating chatroom')
                    }

                    await guests.forEach( async (guest) => {
                        if (guest.id !== manager.id) {
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

            throw new Error("Something went wrong. Please try again")
        }
    }
}