import db from "../../generatePrisma.js"

const handleAccidentOwnership = async (userId, accidentId) => {
    const accident = await db.accident.findUnique({
        where: {
            id: accidentId
        },
        include: {
            user: true
        }
    })

    if (!accident) {
        throw new Error('Error: Accident record does not exist')
    }

    if (accident.user.id === userId) {
        return true
    }

    throw new Error('Error: Not owner of accident record')
}

export default handleAccidentOwnership