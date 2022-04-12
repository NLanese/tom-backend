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
            dspId,
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

            console.log("\nhit begin of driver creation")

///////////////////////////////////
///                             ///
///      CHECKS VALIDITY        ///
///                             ///
///////////////////////////////////

            console.log("\nChecking Validity")

            if (role === 'OWNER') {
                owner = await checkOwnerAuth(token)
            }

            if (role === 'MANAGER') {
                manager = await checkManagerAuth(token)
            }


///////////////////////////////////
///                             ///
///   ATTEMPT TO FIND DRIVER    ///
///                             ///
///////////////////////////////////

            console.log("\nFinding or creating driver")
            console.log(transporterId)

            let findDriver = async (tId, dspId) => {
                return await db.driver.findFirst({
                    where: {
                        transporterId: tId,
                        dspId: dspId
                    }
                })
            }

            let foundDriver
            try {
                findDriver(transporterId, dspId).then( resolved => {
                   foundDriver = resolved
                })
            } catch (error){
                console.log(error)
                throw new Error(error)
            }
            
///////////////////////////////////
///                             ///
///      UPDATE OR CREATE       ///
///                             ///
///////////////////////////////////

            console.log("\nBeginning Update or Create Process")

            email = await email.toUpperCase()
            firstname = await firstname.toUpperCase()
            lastname = await lastname.toUpperCase()

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            password = hash;
        
            // If a manager used the scorecard tool instead of an owner
            if (manager && !foundDriver) {
                console.log("No found driver")
                // Finds the manager
                const foundManager = await db.manager.findUnique({
                    where: {
                        id: manager.id
                    },
                    include: {
                        owner: true
                    }
                })

                // error handling
                if (!foundManager) {
                    throw new Error('Manager does not exist')
                }

                // finds the Owner by using the Manager as a relational bridge 
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

                // error handling
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
 
                    // Checks to make sure a DSP exists first, if so, conncts the driver to it
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
                                        id: dspId
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

                    ///////////////////////////////////
                    ///                             ///
                    ///       CONNECT TO DSP        ///
                    ///                             ///
                    ///////////////////////////////////

                    // If there is no DSP
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

                    // If the Driver failed to create
                    if (!newDriver) {
                        throw new Error('Error creating new driver')
                    }

                    // Adds the driver to each of the managers
                    foundOwner.managers.forEach( async (manager) => {
                        await guestArray.push(manager)

                        const foundManager = await db.manager.findUnique({
                            where: {
                                id: manager.id
                            }
                        })

                        // Adds the manager to the driver
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


                    ///////////////////////////////////
                    ///                             ///
                    ///    CONNECT TO CHATROOMS     ///
                    ///                             ///
                    ///////////////////////////////////

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

                    // If there was an error
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
    
                            // Adds Drivers to the chat room
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
            
            // If a Owner used the scorecard tool
            if (owner && !foundDriver) {
                console.log("\nNo found driver")
                // Finds the owner makes a variable
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

                // if error
                if (!foundOwner) {
                    throw new Error('\nOwner does not exist')
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
                        throw new Error('\nOwner does not exist')
                    }

                    ///////////////////////////////////
                    ///                             ///
                    ///       CONNECT TO DSP        ///
                    ///                             ///
                    ///////////////////////////////////
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
                                transporterId: transporterId,
                                profilePick: "Default"
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
                                transporterId: transporterId,
                                profilePick: "Default"
                            }
                        })
                    }

                    console.log("\nNEW DRIVER:")
                    console.log(newDriver)

                    // If error on creation
                    if (!newDriver) {
                        throw new Error('Error creating driver')
                    }

                    ///////////////////////////////////
                    ///                             ///
                    ///     CONNECT TO MANAGERS     ///
                    ///                             ///
                    ///////////////////////////////////
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

                    ///////////////////////////////////
                    ///                             ///
                    ///    CONNECT TO CHATROOMS     ///
                    ///                             ///
                    ///////////////////////////////////

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

                    console.log("\n------------------\n Completed creating a brand new driver")
                    console.log(newDriver)
                    return await newDriver
                } catch (error) {
                    throw new Error(error)
                }
            }

            if (foundDriver) {
                try {
                    console.log("\n---------------\nFound an existing driver with the same TransID in this DSP")
                    console.log(foundDriver)
                    return await foundDriver
                } catch (error) {
                    throw new Error(error)
                }
            }

        }
    }
}
