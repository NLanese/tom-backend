import db from "../../generatePrisma.js";

const handleAdminInjuryReportOwnership = async (adminId, injuryReportId) => {
    const injuryReport = await db.injuryReport.findUnique({
        where: {
            id: injuryReportId
        }
    })

    if (!injuryReport) {
        throw new Error('Error: Injury report does not exist')
    }

    const accident = await db.accident.findUnique({
        where: {
            id: injuryReport.accidentId
        },
        include: {
            user: true
        }
    })

    if (!accident || !accident.user) {
        throw new Error('Error: Accident does not exist')
    }

    if (accident.user.adminId === adminId) {
        return true
    }

    throw new Error('Error: User is not your employee')

}

export default handleAdminInjuryReportOwnership