import db from '../../utils/generatePrisma.js';
import checkUserAuth from '../../utils/checkAuthorization/check-user-auth.js';
import checkAdminAuth from '../../utils/checkAuthorization/check-admin-auth.js';
import handleAccidentOwnership from '../../utils/handleOwnership/handleDriverOwnership/handleAccidentOwnership.js';
import handleAdminAccidentOwnership from '../../utils/handleOwnership/handleAdminOwnership/handleAdminAccidentOwnership.js';
import handleAdminUserOwnership from '../../utils/handleOwnership/handleAdminOwnership/handleAdminUserOwnership.js'


export default {
    Query: {
        getAccidents: async (_, {}, context) => {
            const user = await checkUserAuth(context)

            try {
                return await db.accident.findMany({
                    where: {
                        id: user.id
                    },
                    include: {
                        thirdParty: true,
                        propertyAccident: true,
                        injuryAccident: true,
                        injuryReport: true,
                        hitPerson: true
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        },

        getAccidentById: async (_, {
            accidentId
        }, context) => {
            const user = await checkUserAuth(context)
            const verified = await handleAccidentOwnership(user.id, accidentId)

            try {
                if (verified) {
                    return await db.accident.findUnique({
                        where: {
                            id: accidentId
                        },
                        include: {
                            thirdParty: true,
                            propertyAccident: true,
                            injuryAccident: true,
                            injuryReport: true,
                            hitPerson: true
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    },

    Mutation: {
        createAccident: async (_, {
            name,
            using_safety,
            safety_failed,
            number_package_carried,
            safety_equipment_used
        }, context) => {
            const user = await checkUserAuth(context)

            // ------- CREATE -------
            try {
                return await db.accident.create({
                    data: {
                        name: name,
                        using_safety: using_safety,
                        safety_failed: safety_failed,
                        number_package_carried: number_package_carried,
                        safety_equipment_used: safety_equipment_used,
                        user: {
                            connect: {
                                id: user.id
                            }
                        }
                    }
                })
            } catch (error) {
                console.log(error)
                throw new Error(error)
            }
        },

        adminCreateAccident: async (_, {
            userId,
            name,
            using_safety,
            safety_failed,
            number_package_carried,
            safety_equipment_used
        }, context) => {
            const admin = await checkAdminAuth(context)
            const verified = await handleAdminUserOwnership(admin.id, userId)

            try {
                if (verified) {
                    return await db.accident.create({
                        data: {
                            name: name,
                            using_safety: using_safety,
                            safety_failed: safety_failed,
                            number_package_carried: number_package_carried,
                            safety_equipment_used: safety_equipment_used,
                            user: {
                                connect: {
                                    id: userId
                                }
                            }
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        },

        // ------- EDIT -------
        updateAccident: async (_, {
            name,
            accidentId,
            using_safety,
            safety_failed,
            number_package_carried,
            safety_equipment_used,
            failed_safety
        }, context) => {
            const user = await checkUserAuth(context)
            const accident = await db.accident.findUnique({
                where: {
                    id: accidentId
                }
            })
            if (!accident) {
                throw new Error('Error: Accident record does not exist')
            }

            const verified = await handleAccidentOwnership(user.id, accidentId)
            try {
                if (verified) {
                    return await db.accident.update({
                        where: {
                            id: accidentId
                        },
                        data: {
                            name: name,
                            using_safety: using_safety,
                            safety_failed: safety_failed,
                            number_package_carried: number_package_carried,
                            safety_equipment_used: safety_equipment_used,
                            failed_safety: failed_safety,
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        },


        adminUpdateAccident: async (_, {
            name,
            accidentId,
            using_safety,
            safety_failed,
            number_package_carried,
            safety_equipment_used,
            failed_safety
        }, context) => {
            const admin = await checkAdminAuth(context)
            const accident = await db.accident.findUnique({
                where: {
                    id: accidentId
                }
            })
            if (!accident) {
                throw new Error('Error: Accident record does not exist')
            }

            const verified = await handleAdminAccidentOwnership(admin.id, accidentId)
            try {
                if (verified) {
                    return await db.accident.update({
                        where: {
                            id: accidentId
                        },
                        data: {
                            name: name,
                            using_safety: using_safety,
                            safety_failed: safety_failed,
                            number_package_carried: number_package_carried,
                            safety_equipment_used: safety_equipment_used,
                            failed_safety: failed_safety,
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        },

        // ------- DELETE -------        
        deleteAccident: async (_, {
            accidentId
        }, context) => {
            const admin = await checkAdminAuth(context)
            const verified = await handleAdminAccidentOwnership(admin.id, accidentId)

            const accident = await db.accident.findUnique({
                where: {
                    id: accidentId
                },
                include: {
                    hitPerson: true,
                    thirdParty: true,
                    injuryAccident: true,
                    propertyAccident: true,
                    injuryReport: true
                }
            })

            if (!accident) {
                throw new Error('Error: Accident record does not exist')
            }

            await db.accident.update({
                where: {
                    id: accidentId
                },
                data: {
                    deleted: true
                }
            })

            if (accident.injuryReport.length !== 0) {
                await db.injuryReport.deleteMany({
                    where: {
                        accidentId: accidentId
                    }
                })
            }

            if (accident.propertyAccident.length !== 0) {
                await db.propertyAccident.deleteMany({
                    where: {
                        accidentId: accidentId
                    }
                })
            }

            if (accident.injuryAccident.length !== 0) {
                await db.injuryAccident.deleteMany({
                    where: {
                        accidentId: accidentId
                    }
                })
            }

            if (accident.thirdParty.length !== 0) {
                await db.thirdParty.deleteMany({
                    where: {
                        accidentId: accidentId
                    }
                })
            }

            if (accident.hitPerson.length !== 0) {
                await db.hitPerson.deleteMany({
                    where: {
                        accidentId: accidentId
                    }
                })
            }

            try {
                if (verified) {
                    return await db.accident.delete({
                        where: {
                            id: accidentId
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}