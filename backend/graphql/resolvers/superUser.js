import db from '../../utils/generatePrisma.js';

export default {
    Query: {
        sGetAllAdmins: async (_, {}, context) => {

            try {
                return await db.admin.findMany({
                    include: {
                        users: true
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    },

    Mutation: {
        sSuspendAdmin: async (_, {
            adminId
        }, context) => {
            // const superUser = await checkSuperAuth(context)
            try{
                if (true){
                    await db.user.updateMany({
                        where: {
                            adminId: adminId
                        },
                        data: {
                            adminAccountStanding: "Suspended"
                        }
                    })
                    return await db.admin.update({
                        where: {
                            id: adminId
                        },
                        data: {
                            accountStatus: "Suspended"
                        },
                        include: {
                            users: true
                        }
                    })
                }
            } catch(error){
                throw new Error(error)
            }
        },

        sDeleteAdmin: async (_, {
            adminId
        }, context) => {
            const admin = await db.admin.findUnique({
                where: {
                    id: adminId
                },
                include: {
                    users: true
                }
            })

            await admin.users.forEach( async (user) => {
                const foundUser = await db.user.findUnique({
                    where: {
                        id: user.id
                    },
                    include: {
                        accidents: {
                            include: {
                                hitPerson: true,
                                thirdParty: true,
                                injuryAccident: true,
                                propertyAccident: true,
                                injuryReport: true
                            }
                        }
                    }
                })

                foundUser.accidents.forEach( async (accident) => {
                    const foundHitPerson = await db.hitPerson.findMany({
                        where: {
                            accidentId: accident.id
                        }
                    })

                    if (foundHitPerson.length !== 0) {
                        await db.hitPerson.deleteMany({
                            where: {
                                accidentId: accident.id
                            }
                        })
                    }

                    const foundThirdParty = await db.thirdParty.findMany({
                        where: {
                            accidentId: accident.id
                        }
                    })

                    if (foundThirdParty.length !== 0) {
                        await db.thirdParty.deleteMany({
                            where: {
                                accidentId: accident.id
                            }
                        })
                    }

                    const foundInjuryReport = await db.injuryReport.findMany({
                        where: {
                            accidentId: accident.id
                        }
                    })

                    if (foundInjuryReport.length !== 0) {
                        await db.injuryReport.deleteMany({
                            where: {
                                accidentId: accident.id
                            }
                        })
                    }

                    const foundPropertyAccident = await db.propertyAccident.findMany({
                        where: {
                            accidentId: accident.id
                        }
                    })

                    if (foundPropertyAccident.length !== 0) {
                        await db.propertyAccident.deleteMany({
                            where: {
                                accidentId: accident.id
                            }
                        })
                    }

                    const foundInjuryAccident = await db.injuryAccident.findMany({
                        where: {
                            accidentId: accident.id
                        }
                    })

                    if (foundInjuryAccident.length !== 0) {
                        await db.injuryAccident.deleteMany({
                            where: {
                                accidentId: accident.id
                            }
                        })
                    }

                    await db.accident.delete({
                        where: {
                            id: accident.id
                        }
                    })
                })

                await db.user.delete({
                    where: {
                        id: user.id
                    }
                })
            })

            try {
                return await db.admin.delete({
                    where: {
                        id: adminId
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        },

        sUpdateAdmin: async (_, {
            adminId,
            email,
            username,
            firstname,
            lastname,
            password,
            paid,
            accountStatus,
            deleted
        }, context) => {
            // const super = await checkSuperAuth(context)
            try{
                if (typeof password !== "undefined") {
                    password = await hashPassword(password)
                }
    
                if (email) {
                    email = email.toUpperCase()
                }
    
                if (username) {
                    username = username.toUpperCase()
                }
    
                if (firstname) {
                    firstname = firstname.toUpperCase()
                }
    
                if (lastname) {
                    lastname = lastname.toUpperCase()
                }

                if (true){
                    return await db.admin.update({
                        where: {
                            id: adminId
                        },
                        data: {
                            email: email,
                            username: username,
                            firstname: firstname,
                            lastname: lastname,
                            password: password,
                            paid: paid,
                            accountStatus: accountStatus,
                            deleted: deleted
                        }
                    })
                }
            } catch(error){
                throw new Error(error)
            }
        }
    }
}