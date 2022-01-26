import db from "../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-admin-auth.js";
import hashPassword from "../../../../utils/passwordHashing.js";

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
            password = await hashPassword(password)
            

            if (manager && !foundDriver) {
                const foundManager = await db.admin.findUnique({
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
                        admins: true,
                        dsp: true
                    }
                })

                try {
                    let newDriver

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

                    foundOwner.admins.forEach( async (admin) => {
                        const foundAdmin = await db.admin.findUnique({
                            where: {
                                id: admin.id
                            }
                        })

                        if (foundAdmin) {
                            await db.driver.update({
                                where: {
                                    id: newDriver.id
                                },
                                data: {
                                    admins: {
                                        connect: {
                                            id: admin.id 
                                        }
                                    },
                                }
                            })
                        }
                    })

                    return newDriver
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
                        admins: true,
                        dsp: true
                    }
                })

                try {
                    let newDriver

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

                    foundOwner.admins.forEach( async (admin) => {
                        const foundAdmin = await db.admin.findUnique({
                            where: {
                                id: admin.id
                            }
                        })

                        if (foundAdmin) {
                            await db.driver.update({
                                where: {
                                    id: newDriver.id
                                },
                                data: {
                                    admins: {
                                        connect: {
                                            id: admin.id 
                                        }
                                    },
                                }
                            })
                        }
                    })

                    return newDriver
                } catch (error) {
                    throw new Error(error)
                }
            }

            if (foundDriver) {
                try {
                    return foundDriver
                } catch (error) {
                    throw new Error(error)
                }
            }

        }
    }
}
