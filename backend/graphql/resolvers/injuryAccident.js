import checkUserAuth from '../../utils/checkAuthorization/check-user-auth.js';
import checkAdminAuth from '../../utils/checkAuthorization/check-admin-auth.js';
import db from '../../utils/generatePrisma.js';
import { handleAccidentOwnership } from '../../utils/handleOwnership/handleAccidentOwnership.js';
import handleAdminInjuryAccidentOwnership from '../../utils/handleOwnership/handleAdminInjuryAccidentOwnership.js';
import { handleInjuryAccidentOwnership } from '../../utils/handleOwnership/handleInjuryAccidentOwnership.js';

export default {
    Mutation: {
        createInjuryAccident: async (_, {
            accidentId,
            self_injured,
            vehicle_number,
            amazon_logo,
            exact_address,
            action_before_accident,
            police_report,
            weather,
            wet_ground,
            slippery_ground,
            extra_info,
            rushed_prior
        }, context) => {
            const user = await checkUserAuth(context)
            const verified = await handleAccidentOwnership(user.id, accidentId)

            try {
                if (verified) {
                    return await db.injuryAccident.create({
                        data: {
                            accident: {
                                connect: {
                                    id: accidentId
                                }
                            },
                            accidentId: accidentId,
                            self_injured: self_injured,
                            vehicle_number: vehicle_number,
                            amazon_logo: amazon_logo,
                            exact_address: exact_address,
                            action_before_accident: action_before_accident,
                            police_report: police_report,
                            weather: weather,
                            wet_ground: wet_ground,
                            slippery_ground: slippery_ground,
                            extra_info: extra_info,
                            rushed_prior: rushed_prior
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        },

        updateInjuryAccident: async (_, {
            injuryAccidentId,
            self_injured,
            vehicle_number,
            amazon_logo,
            exact_address,
            action_before_accident,
            police_report,
            weather,
            wet_ground,
            slippery_ground,
            extra_info,
            rushed_prior
        }, context) => {
            const user = await checkUserAuth(context)

            const injuryAccident = await db.injuryAccident.findUnique({
                where: {
                    id: injuryAccidentId
                }
            })

            if (!injuryAccident) {
                throw new Error('Error: Injury accident record does not exist')
            }

            const verified = await handleInjuryAccidentOwnership(user.id, injuryAccidentId)

            try {
                if (verified) {
                    return await db.injuryAccident.update({
                        where: {
                            id: injuryAccidentId
                        },
                        data: {
                            self_injured: self_injured,
                            vehicle_number: vehicle_number,
                            amazon_logo: amazon_logo,
                            exact_address: exact_address,
                            action_before_accident: action_before_accident,
                            police_report: police_report,
                            weather: weather,
                            wet_ground: wet_ground,
                            slippery_ground: slippery_ground,
                            extra_info: extra_info,
                            rushed_prior: rushed_prior
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        },

        adminUpdateInjuryAccident: async (_, {
            injuryAccidentId,
            self_injured,
            vehicle_number,
            amazon_logo,
            exact_address,
            action_before_accident,
            police_report,
            weather,
            wet_ground,
            slippery_ground,
            extra_info,
            rushed_prior
        }, context) => {
            const admin = await checkAdminAuth(context)

            const injuryAccident = await db.injuryAccident.findUnique({
                where: {
                    id: injuryAccidentId
                }
            })

            if (!injuryAccident) {
                throw new Error('Error: Injury accident record does not exist')
            }

            const verified = await handleAdminInjuryAccidentOwnership(admin.id, injuryAccidentId)

            try {
                if (verified) {
                    return await db.injuryAccident.update({
                        where: {
                            id: injuryAccidentId
                        },
                        data: {
                            self_injured: self_injured,
                            vehicle_number: vehicle_number,
                            amazon_logo: amazon_logo,
                            exact_address: exact_address,
                            action_before_accident: action_before_accident,
                            police_report: police_report,
                            weather: weather,
                            wet_ground: wet_ground,
                            slippery_ground: slippery_ground,
                            extra_info: extra_info,
                            rushed_prior: rushed_prior
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        },

        deleteInjuryAccident: async (_, {
            injuryAccidentId
        }, context) => {
            const admin = await checkAdminAuth(context)
            const injuryAccident = await db.injuryAccident.findUnique({
                where: {
                    id: injuryAccidentId
                }
            })
            if (!injuryAccident) {
                throw new Error('Error: Injury accident record does not exist')
            }
            const verified = await handleAdminInjuryAccidentOwnership(admin.id, injuryAccidentId)

            await db.injuryAccident.update({
                where: {
                    id: injuryAccidentId
                },
                data: {
                    deleted: true
                }
            })
            
            try {
                if (verified) {
                    console.log("Delete in progress")
                    return await db.injuryAccident.delete({
                        where: {
                            id: injuryAccidentId
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}