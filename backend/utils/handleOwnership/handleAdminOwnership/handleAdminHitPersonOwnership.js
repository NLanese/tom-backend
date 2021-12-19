import db from "../../generatePrisma.js";

const handleAdminHitPersonOwnership = async (adminId, hitPersonId) => {
    const hitPerson = await db.hitPerson.findUnique({
        where: {
            id: hitPersonId
        }
    })

    if (!hitPerson) {
        throw new Error("Error: Hit person record does not exist")
    }

    const accident = await db.accident.findUnique({
        where: {
            id: hitPerson.accidentId
        },
        include: {
            user: true
        }
    })

    if (!accident || !accident.user) {
        throw new Error("Error: Accident record does not exist")
    }

    if (accident.user.adminId === adminId) {
        return true
    }

    throw new Error('The User associated with this accident is not your employee')
}

export default handleAdminHitPersonOwnership