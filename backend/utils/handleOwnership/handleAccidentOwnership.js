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

    console.log(accident.user.id, userId)

    if (accident.user.id === userId) {
        console.log('hit')
        return true
    }

    throw new Error('Not accident owner')
}

console.log(handleAccidentOwnership(1, 1))