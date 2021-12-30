import checkUserAuth from '../../utils/checkAuthorization/check-driver-auth.js';
import checkAdminAuth from '../../utils/checkAuthorization/check-admin-auth.js';
import db from '../../utils/generatePrisma.js';
import handleAccidentOwnership from '../../utils/handleOwnership/handleDriverOwnership/handleAccidentOwnership.js';
import handlePropertyAccidentOwnership from '../../utils/handleOwnership/handleDriverOwnership/handlePropertyAccidentOwnership.js';
import handleAdminPropertyAccidentOwnership from '../../utils/handleOwnership/handleAdminOwnership/handleAdminPropertyAccidentOwnership.js'

export default {
    Mutation: {
        // -------- CREATE ---------
        createPropertyAccident: async (_, {
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
            const driver = await checkUserAuth(context)
            const verified = await handleAccidentOwnership(driver.id, accidentId)

            try {
                if (verified) {
                    return await db.propertyAccident.create({
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

        // ------- UPDATE -------         
        updatePropertyAccident: async (_, {
            propertyAccidentId,
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
            const driver = await checkUserAuth(context)

            const propertyAccident = await db.propertyAccident.findUnique({
                where: {
                    id: propertyAccidentId
                }
            })

            if (!propertyAccident) {
                throw new Error('Error: Property accident record does not exist')
            }

            const verified = await handlePropertyAccidentOwnership(driver.id, propertyAccidentId)

            try {
                if (verified) {
                    return await db.propertyAccident.update({
                        where: {
                            id: propertyAccidentId
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

        adminUpdatePropertyAccident: async (_, {
            propertyAccidentId,
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

            const propertyAccident = await db.propertyAccident.findUnique({
                where: {
                    id: propertyAccidentId
                }
            })

            if (!propertyAccident) {
                throw new Error('Error: Property accident record does not exist')
            }

            const verified = await handleAdminPropertyAccidentOwnership(admin.id, propertyAccidentId)

            try {
                if (verified) {
                    return await db.propertyAccident.update({
                        where: {
                            id: propertyAccidentId
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

        // ------- DELETE -------        
        deletePropertyAccident: async (_, {
            propertyAccidentId
        }, context) => {
            const admin = await checkAdminAuth(context)

            const propertyAccident = await db.propertyAccident.findUnique({
                where: {
                    id: propertyAccidentId
                }
            })

            if (!propertyAccident) {
                throw new Error('Error: Property accident record does not exist')
            }

            const verified = await handleAdminPropertyAccidentOwnership(admin.id, propertyAccidentId)

            await db.propertyAccident.update({
                where: {
                    id: propertyAccidentId
                },
                data: {
                    deleted: true
                }
            })

            try {
                if (verified) {
                    return await db.propertyAccident.delete({
                        where: {
                            id: propertyAccidentId
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}