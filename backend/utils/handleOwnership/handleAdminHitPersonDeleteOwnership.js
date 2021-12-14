import db from "../generatePrisma.js";

const handleAdminHitPersonDeleteOwnership = async (adminId, hitPersonId) => {
    const hitPerson = await db.hitPerson.findUnique({
        where: { id: hitPersonId }
    })
    if (!hitPerson){
        throw new Error("Error: there is no record of this individual")
    }

    const accident = await db.accident.findUnique({
        where: { id: hitPerson.accident },
        include: { user: true }
    })
    if (!accident){
        throw new Error("Error: Accident record does not exist")
    }

    if (accident.user.adminId === adminId){
        return true
    }

    throw new Error('The User associated with this accident is not your employee')
}

export default handleAdminHitPersonDeleteOwnership