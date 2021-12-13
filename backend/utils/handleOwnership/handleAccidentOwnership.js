import db from "../generatePrisma.js"

export const handleAccidentOwnership = async (userId, accidentId) => {
    const accident = await db.accident.findUnique({
        where: {
            id: accidentId
        },
        include: {
            user: true
        }
    })

    if (accident.user.id === userId) {
        return true
    }

    throw new Error('Not accident owner')
}