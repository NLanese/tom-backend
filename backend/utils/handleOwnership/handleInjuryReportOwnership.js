import db from "../generatePrisma.js"

export const handleInjuryReportOwnership = async (userId, injuryReportId) => {
    const injuryReport = await db.injuryReport.findUnique({
        where: {
            id: injuryReportId
        },
        include: {
            accident: {
                include: {
                    user: true
                }
            }
        }
    })

    if (!injuryReport) {
        throw new Error('Error: Accident record does not exist')
    }

    if (injuryReport.accident[0].user.id === userId){
        return true
    }

    throw new Error("Error: Not owner of injury report")
}