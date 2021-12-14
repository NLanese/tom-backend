import db from "../generatePrisma.js"

export const handleInjuryReportOwnership = async (userId, injuryReportId) => {
    const injuryReport = await db.injuryReport.findUnique({
        where: {
            id: injuryReportId
        },
        include: {
            user: true
        }
    })

    if (injuryReport.user.id === userId){
        return true
    }

    throw new Error("Error: not owner of injury report")
}