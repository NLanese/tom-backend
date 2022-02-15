import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js"

export default {
    Mutation: {
        dynamicLeaveChatroom: async (_, {
            role,
            chatroomId
        }, context) => {
            let owner = { id: null };
            let manager = { id: null };
            let driver = { id: null };

            // DYNAMIC AUTHORIZATION CHECK
            if (role === 'OWNER') owner = await checkOwnerAuth(context)
            if (role === 'MANAGER') manager = await checkManagerAuth(context)
            if (role === 'DRIVER') driver = await checkDriverAuth(context)

            const foundChatroom = await db.chatroom.findUnique({
                where: {
                    id: chatroomId
                }
            })

            // ERROR HANDLING
            if (!foundChatroom) throw new Error('Chatroom does not exist')
            // if (foundChatroom.chatroomOwner.id === owner.id   ||
            //     foundChatroom.chatroomOwner.id === manager.id ||
            //     foundChatroom.chatroomOwner.id === driver.id) {
            //         throw new Error("Cannot leave chatroom... You are the chatroom owner")
            // }

            let guests = foundChatroom.guests

            if (owner.id !== null) { 
                try {
                    await guests.forEach( async (guest, index) => {
                        if (guest.id === owner.id) {
                            guests.splice(index, 1)
        
                            await db.owner.update({
                                where: {
                                    id: guest.id
                                },
                                data: {
                                    chatrooms: {
                                        disconnect: {
                                            id: chatroomId
                                        }
                                    }
                                }
                            })
                        }  
                    })

                    return await db.chatroom.update({
                        where: {
                            id: chatroomId
                        },
                        data: {
                            guests: guests,
                            owner: {
                                disconnect: {
                                    id: owner.id
                                }
                            }
                        }
                    })
                } catch {error} {
                    throw new Error(error)
                }
            }

            if (manager.id !== null) {
                try {
                    await guests.forEach( async (guest, index) => {
                        if (guest.id === manager.id) {
                            guests.splice(index, 1)
        
                            await db.manager.update({
                                where: {
                                    id: guest.id
                                },
                                data: {
                                    chatrooms: {
                                        disconnect: {
                                            id: chatroomId
                                        }
                                    }
                                }
                            })
                        }  
                    })

                    return await db.chatroom.update({
                        where: {
                            id: chatroomId
                        },
                        data: {
                            guests: guests,
                            managers: {
                                disconnect: {
                                    id: manager.id
                                }
                            }
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }

            if (driver.id !== null) {
                try {
                    await guests.forEach( async (guest, index) => {
                        if (guest.id === driver.id) {
                            guests.splice(index, 1)
        
                            await db.driver.update({
                                where: {
                                    id: guest.id
                                },
                                data: {
                                    chatrooms: {
                                        disconnect: {
                                            id: chatroomId
                                        }
                                    }
                                }
                            })
                        }  
                    })

                    return await db.chatroom.update({
                        where: {
                            id: chatroomId
                        },
                        data: {
                            guests: guests,
                            drivers: {
                                disconnect: {
                                    id: driver.id
                                }
                            }
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }
        }
    }
}