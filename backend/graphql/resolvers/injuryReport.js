import checkUserAuth from '../../utils/checkAuthorization/check-user-auth.js';
import db from '../../utils/generatePrisma.js';
import { handleAccidentOwnership } from '../../utils/handleOwnership/handleAccidentOwnership.js';
import { handleInjuryReportOwnership } from '../../utils/handleOwnership/handleInjuryReportOwnership.js';

export default{
    Mutation: {

        // -------- CREATE --------
        createInjuryReport: async (_, {accidentId, immediate_attention, late, self_injured, injury_type, other_injured, before_injury, packages, safety_equipment, unsafe_conditions, pain_level, additional_information}, context) => {
            const user = await checkUserAuth(context)
            const verified = await handleAccidentOwnership(user.id, accidentId)

            try{
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
            } catch(error){
                console.log(error)
                throw new Error(error)
            }
        },


         // -------- UPDATE --------
         updateInjuryReport: async (_, {injuryReportId, immediate_attention, late, self_injured, injury_type, other_injured, before_injury, packages, safety_equipment, unsafe_conditions, pain_level, additional_information}, context) => {
            const user = await checkUserAuth(context)
            const verified = await handleInjuryReportOwnership(user.id, injuryReportId)

            try{
                if (verified){
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
            } catch(error){
                throw new Error(error)
            }
        },


        // -------- DELETE --------
        deleteInjuryReport: async (_, {injuryReportId}, context) => {
            // change this to admin = checkAdminAuth later
            const user = await checkUserAuth(context)
            const verified = handleInjuryReportOwnership(user.id, injuryReportId)
            
            try{
                if (verified){
                    return await db.injuryReport.delete({
                        where: {id: injuryReportId}
                    })
                }
            } catch(error){
                throw new Error(error)
            }
        }
    }
}