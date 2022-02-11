import db from "../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";
import hashPassword from "../../../../utils/passwordHashing.js";
import bcrypt from 'bcryptjs';

// BUGS TO FIX
// DOESNT HAVE ALL THE DRIVERS JOIN THE BREAKROOM CHAT
// RAN TWO TEST ONE HAD 17 THE OTHER HAD 29
// ---------------------------------------------------
// NEED TO ADD CHATROOM CREATION FUNCTIONALITY TO MANAGER 
export default {
    Mutation: {
        scorecardToolCreateDriverAccounts: async (_, {
            email,
            firstname,
            lastname,
            phoneNumber,
            password,
            transporterId,
            role
        }, context) => {
            let owner;
            let manager;

            if (role === 'OWNER') {
                owner = await checkOwnerAuth(context)
            }

            if (role === 'MANAGER') {
                manager = await checkManagerAuth(context)
            }

            const foundDriver = await db.driver.findUnique({
                where: {
                    transporterId
                }
            })

            email = await email.toUpperCase()
            firstname = await firstname.toUpperCase()
            lastname = await lastname.toUpperCase()

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            password = hash;
            

            if (manager && !foundDriver) {
                const foundManager = await db.manager.findUnique({
                    where: {
                        id: manager.id
                    },
                    include: {
                        owner: true
                    }
                })

                const foundOwner = await db.owner.findUnique({
                    where: {
                        id: foundManager.owner.id
                    },
                    include: {
                        managers: true,
                        dsp: true,
                        chatrooms: true
                    }
                })

                try {
                    let newDriver
                    let guestArray = []

                    const justOwnerRecord = await db.owner.findUnique({
                        where: {
                            id: foundOwner.id
                        }
                    })

                    if (foundOwner.dsp) {
                        newDriver = await db.driver.create({
                            data: {
                                owner: {
                                    connect: {
                                        id: owner.id
                                    }
                                },
                                dsp: {
                                    connect: {
                                        id: foundOwner.dsp.id
                                    }
                                },
                                email: email,
                                password: password,
                                firstname: firstname,
                                lastname: lastname,
                                phoneNumber: phoneNumber,
                                transporterId: transporterId
                            }
                        })
                    }

                    if (!foundOwner.dsp) {
                        newDriver = await db.driver.create({
                            data: {
                                owner: {
                                    connect: {
                                        id: foundOwner.id
                                    }
                                },
                                email: email,
                                password: password,
                                firstname: firstname,
                                lastname: lastname,
                                phoneNumber: phoneNumber,
                                transporterId: transporterId
                            }
                        })
                    }

                    foundOwner.managers.forEach( async (manager) => {
                        await guestArray.push(manager)

                        const foundManager = await db.manager.findUnique({
                            where: {
                                id: manager.id
                            }
                        })

                        if (foundManager) {
                            await db.driver.update({
                                where: {
                                    id: newDriver.id
                                },
                                data: {
                                    managers: {
                                        connect: {
                                            id: manager.id 
                                        }
                                    },
                                }
                            })
                        }
                    })

                    // Create driver/management chatroom
                    const newChatroom = await db.chatroom.create({
                        data: {
                            guests: [ newDriver, justOwnerRecord, ...guestArray ],
                            chatroomOwner: justOwnerRecord,
                            chatroomName: `${newDriver.firstname} ${newDriver.lastname} management chatroom`,
                            owner: {
                                connect: {
                                    id: foundOwner.id
                                }
                            }
                        }
                    })

                    // Updates the newChatroom record to handle Driver Relationship
                    await db.chatroom.update({
                        where: {
                            id: newChatroom.id
                        },
                        data: {
                            drivers: {
                                connect: {
                                    id: newDriver.id
                                }
                            }
                        }
                    })

                    // Relates the rest of the Managers to newChatroom
                    await guestArray.forEach( async (guest) => {
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
                    })

                    // Joins all other chatrooms driver is suppose to join
                    await foundOwner.chatrooms.forEach( async (chatroom) => {
                        if (chatroom.driverJoinOnSignUp === true) {
                            const foundChatroom = await db.chatroom.findUnique({
                                where: {
                                    id: chatroom.id
                                }
                            })
    
                            const guestDspArray = await foundChatroom.guests
    
                            await db.chatroom.update({
                                where: {
                                    id: chatroom.id
                                },
                                data: {
                                    drivers: {
                                        connect: {
                                            id: newDriver.id
                                        }
                                    },
                                    guests: [ ...guestDspArray, newDriver]
                                }
                            })
                        }
                    })

                    return await newDriver
                } catch (error) {
                    throw new Error(error)
                }
            }
            
            if (owner && !foundDriver) {
                const foundOwner = await db.owner.findUnique({
                    where: {
                        id: owner.id
                    },
                    include: {
                        managers: true,
                        dsp: true,
                        chatrooms: true
                    }
                })

                try {
                    let newDriver
                    let guestArray = []

                    const justOwnerRecord = await db.owner.findUnique({
                        where: {
                            id: foundOwner.id
                        }
                    })

                    if (foundOwner.dsp) {
                        newDriver = await db.driver.create({
                            data: {
                                owner: {
                                    connect: {
                                        id: owner.id
                                    }
                                },
                                dsp: {
                                    connect: {
                                        id: foundOwner.dsp.id
                                    }
                                },
                                email: email,
                                password: password,
                                firstname: firstname,
                                lastname: lastname,
                                phoneNumber: phoneNumber,
                                transporterId: transporterId
                            }
                        })
                    }

                    if (!foundOwner.dsp) {
                        newDriver = await db.driver.create({
                            data: {
                                owner: {
                                    connect: {
                                        id: owner.id
                                    }
                                },
                                email: email,
                                password: password,
                                firstname: firstname,
                                lastname: lastname,
                                phoneNumber: phoneNumber,
                                transporterId: transporterId
                            }
                        })
                    }

                    foundOwner.managers.forEach( async (manager) => {
                        await guestArray.push(manager)

                        const foundManager = await db.manager.findUnique({
                            where: {
                                id: manager.id
                            }
                        })

                        if (foundManager) {
                            await db.driver.update({
                                where: {
                                    id: newDriver.id
                                },
                                data: {
                                    managers: {
                                        connect: {
                                            id: manager.id 
                                        }
                                    },
                                }
                            })
                        }
                    })

                    // console.log('hit before chatroom additions')

                    // Create driver/management chatroom
                    const newChatroom = await db.chatroom.create({
                        data: {
                            guests: [ newDriver, justOwnerRecord, ...guestArray ],
                            chatroomOwner: justOwnerRecord,
                            chatroomName: `${newDriver.firstname} ${newDriver.lastname} management chatroom`,
                            owner: {
                                connect: {
                                    id: foundOwner.id
                                }
                            }
                        }
                    })

                    // console.log('hit after newChatroom Creation')

                    // Updates the newChatroom record to handle Driver Relationship
                    await db.chatroom.update({
                        where: {
                            id: newChatroom.id
                        },
                        data: {
                            drivers: {
                                connect: {
                                    id: newDriver.id
                                }
                            }
                        }
                    })

                    // console.log('hit after update newChatroom to add driver relation')

                    // Relates the rest of the Managers to newChatroom
                    await guestArray.forEach( async (guest) => {
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
                    })

                    // console.log('hit after relating the rest of the managers to newChatroom')

                    // Joins all other chatrooms driver is suppose to join
                    await foundOwner.chatrooms.forEach( async (chatroom) => {
                        if (chatroom.driverJoinOnSignUp === true) {
                            const foundChatroom = await db.chatroom.findUnique({
                                where: {
                                    id: chatroom.id
                                }
                            })
    
                            const guestDspArray = await foundChatroom.guests
    
                            await db.chatroom.update({
                                where: {
                                    id: chatroom.id
                                },
                                data: {
                                    drivers: {
                                        connect: {
                                            id: newDriver.id
                                        }
                                    },
                                    guests: [ ...guestDspArray, newDriver]
                                }
                            })
                        }
                    })

                    // console.log('hit after adding drive to the other chatrooms')

                    return await newDriver
                } catch (error) {
                    throw new Error(error)
                }
            }

            if (foundDriver) {
                try {
                    return await foundDriver
                } catch (error) {
                    throw new Error(error)
                }
            }

        }
    }
}
