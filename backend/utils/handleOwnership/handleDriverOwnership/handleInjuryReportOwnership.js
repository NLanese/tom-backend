import db from "../../generatePrisma.js"

const handleInjuryReportOwnership = async (driverId, injuryReportId) => {
    const injuryReport = await db.injuryReport.findUnique({
        where: {
            id: injuryReportId
        },
        include: {
            accident: {
                include: {
                    driver: true
                }
            }
        }
    })

    if (!injuryReport || !injuryReport.accident || !injuryReport.accident[0].driver) {
        throw new Error('Error: Accident record does not exist')
    }

    if (injuryReport.accident[0].driver.id === driverId){
        return true
    }

    throw new Error("Error: Not owner of injury report")
}

export default handleInjuryReportOwnership