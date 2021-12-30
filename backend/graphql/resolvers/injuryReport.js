import checkUserAuth from '../../utils/checkAuthorization/check-driver-auth.js';
import checkAdminAuth from '../../utils/checkAuthorization/check-admin-auth.js';
import db from '../../utils/generatePrisma.js';
import handleAccidentOwnership from '../../utils/handleOwnership/handleDriverOwnership/handleAccidentOwnership.js';
import handleInjuryReportOwnership from '../../utils/handleOwnership/handleDriverOwnership/handleInjuryReportOwnership.js';
import handleAdminInjuryReportOwnership from '../../utils/handleOwnership/handleAdminOwnership/handleAdminInjuryReportOwnership.js';

export default {
    Mutation: {
        // -------- CREATE --------
        createInjuryReport: async (_, {
            accidentId,
            immediate_attention,
            late,
            self_injured,
            injury_type,
            other_injured,
            before_injury,
            packages,
            safety_equipment,
            unsafe_conditions,
            pain_level,
            additional_information
        }, context) => {
            const driver = await checkUserAuth(context)
            const verified = await handleAccidentOwnership(driver.id, accidentId)

            try {
                if (verified) {
                    return await db.injuryReport.create({
                        data: {
                            accident: {
                                connect: {
                                    id: accidentId
                                }
                            },
                            accidentId: accidentId,
                            immediate_attention: immediate_attention,
                            late: late,
                            self_injured: self_injured,
                            injury_type: injury_type,
                            other_injured: other_injured,
                            before_injury: before_injury,
                            packages: packages,
                            safety_equipment: safety_equipment,
                            unsafe_conditions: unsafe_conditions,
                            pain_level: pain_level,
                            additional_information: additional_information
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        },


        // -------- UPDATE --------
        updateInjuryReport: async (_, {
            injuryReportId,
            immediate_attention,
            late,
            self_injured,
            injury_type,
            other_injured,
            before_injury,
            packages,
            safety_equipment,
            unsafe_conditions,
            pain_level,
            additional_information
        }, context) => {
            const driver = await checkUserAuth(context)

            const injuryReport = await db.injuryReport.findUnique({
                where: {
                    id: injuryReportId
                }
            })

            if (!injuryReport) {
                throw new Error('Error: Injury report record does not exist')
            }

            const verified = await handleInjuryReportOwnership(driver.id, injuryReportId)

            try {
                if (verified) {
                    return await db.injuryReport.update({
                        where: {
                            id: injuryReportId
                        },
                        data: {
                            immediate_attention: immediate_attention,
                            late: late,
                            self_injured: self_injured,
                            injury_type: injury_type,
                            other_injured: other_injured,
                            before_injury: before_injury,
                            packages: packages,
                            safety_equipment: safety_equipment,
                            unsafe_conditions: unsafe_conditions,
                            pain_level: pain_level,
                            additional_information: additional_information
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        },

        adminUpdateInjuryReport: async (_, {
            injuryReportId,
            immediate_attention,
            late,
            self_injured,
            injury_type,
            other_injured,
            before_injury,
            packages,
            safety_equipment,
            unsafe_conditions,
            pain_level,
            additional_information
        }, context) => {
            const admin = await checkAdminAuth(context)

            const injuryReport = await db.injuryReport.findUnique({
                where: {
                    id: injuryReportId
                }
            })

            if (!injuryReport) {
                throw new Error('Error: Injury report record does not exist')
            }

            const verified = await handleAdminInjuryReportOwnership(admin.id, injuryReportId)

            try {
                if (verified) {
                    return await db.injuryReport.update({
                        where: {
                            id: injuryReportId
                        },
                        data: {
                            immediate_attention: immediate_attention,
                            late: late,
                            self_injured: self_injured,
                            injury_type: injury_type,
                            other_injured: other_injured,
                            before_injury: before_injury,
                            packages: packages,
                            safety_equipment: safety_equipment,
                            unsafe_conditions: unsafe_conditions,
                            pain_level: pain_level,
                            additional_information: additional_information
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        },


        // -------- DELETE --------
        deleteInjuryReport: async (_, {
            injuryReportId
        }, context) => {
            const admin = await checkAdminAuth(context)

            const injuryReport = await db.injuryReport.findUnique({
                where: {
                    id: injuryReportId
                }
            })

            if (!injuryReport) {
                throw new Error('Error: Injury report record does not exist')
            }

            const verified = await handleAdminInjuryReportOwnership(admin.id, injuryReportId)

            await db.injuryReport.update({
                where: {
                    id: injuryReportId
                },
                data: {
                    deleted: true
                }
            })

            try {
                if (verified) {
                    return await db.injuryReport.delete({
                        where: {
                            id: injuryReportId
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}