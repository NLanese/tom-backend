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
            driver: true
        }
    })

    if (!accident || !accident.driver) {
        throw new Error('Error: Accident does not exist')
    }

    if (accident.driver.adminId === adminId) {
        return true
    }

    throw new Error('Error: Driver is not your employee')

}

export default handleAdminInjuryReportOwnership