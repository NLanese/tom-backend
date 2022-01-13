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
            driver: true
        }
    })

    if (!accident || !accident.driver) {
        throw new Error("Error: Accident record does not exist")
    }

    if (accident.driver.adminId === adminId) {
        return true
    }

    throw new Error('The Driver associated with this accident is not your employee')
}

export default handleAdminHitPersonOwnership