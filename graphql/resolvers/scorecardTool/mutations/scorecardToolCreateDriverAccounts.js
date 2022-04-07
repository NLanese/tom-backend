import db from "../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";
import bcrypt from 'bcryptjs';

// BUGS TO FIX
// DOESNT HAVE ALL THE DRIVERS JOIN THE BREAKROOM CHAT
// RAN TWO TEST ONE HAD 17 THE OTHER HAD 29
// ---------------------------------------------------
// NEED TO ADD CHATROOM CREATION FUNCTIONALITY TO MANAGER 
export default {
    Mutation: {
        scorecardToolCreateDriverAccounts: async (_, {
            token,
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

            console.log("hit begin of driver creation")

            if (role === 'OWNER') {
                owner = await checkOwnerAuth(token)
            }

            if (role === 'MANAGER') {
                manager = await checkManagerAuth(token)
            }

            console.log("Hit 2")

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
            
            console.log("Hit3")
            console.log(owner)
            console.log(manager)
            console.log(foundDriver)

            if (manager && !foundDriver) {
                const foundManager = await db.manager.findUnique({
                    where: {
                        id: manager.id
                    },
                    include: {
                        owner: true
                    }
                })

                if (!foundManager) {
                    throw new Error('Manager does not exist')
                }

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

                if (!foundOwner) {
                    throw new Error('Owner does not exist')
                }

                try {
                    let newDriver
                    let guestArray = []

                    const justOwnerRecord = await db.owner.findUnique({
                        where: {
                            id: foundOwner.id
                        }
                    })

                    if (!justOwnerRecord) {
                        throw new Error('Owner does not exist')
                    }
 
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

                    if (!newDriver) {
                        throw new Error('Error creating new driver')
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

                    if (!newChatroom) {
                        throw new Error('Error creating chatroom')
                    }

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
                console.log("Hit4")
                conosle.log(owner)
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

                if (!foundOwner) {
                    throw new Error('Owner does not exist')
                }

                try {
                    let newDriver
                    let guestArray = []

                    const justOwnerRecord = await db.owner.findUnique({
                        where: {
                            id: foundOwner.id
                        }
                    })

                    if (!justOwnerRecord) {
                        throw new Error('Owner does not exist')
                    }

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

                    if (!newDriver) {
                        throw new Error('Error creating driver')
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

                    if (!newChatroom) {
                        throw new Error('Error creating chatroom')
                    }

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
