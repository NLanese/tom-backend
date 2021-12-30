import db from "../../generatePrisma.js";

const handleAdminThirdPartyOwnership = async (adminId, thirdPartyId) => {
    const collision = await db.collision.findUnique({
        where: {
            id: thirdPartyId
        }
    })

    if (!collision) {
        throw new Error('Error: Third party record does not exist')
    }

    const accident = await db.accident.findUnique({
        where: {
            id: collision.accidentId
        },
        include: {
            user: true
        }
    })

    if (!accident || !accident.user) {
        throw new Error('Error: Accident record does not exist')
    }

    if (accident.user.adminId === adminId) {
        return true
    }

    throw new Error('Error: User is nor your employee')
}

export default handleAdminThirdPartyOwnership