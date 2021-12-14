import db from "../generatePrisma.js";

const handleAdminThirdPartyDeleteOwnership = async (adminId, thirdPartyId) => {
    const thirdParty = await db.thirdParty.findUnique({
        where: {
            id: thirdPartyId
        }
    })

    if (!thirdParty) {
        throw new Error('Error: Third party record does not exist')
    }

    const accident = await db.accident.findUnique({
        where: {
            id: thirdParty.accidentId
        },
        include: {
            user: true
        }
    })

    if (!accident) {
        throw new Error('Error: Accident record does not exist')
    }

    if (accident.user.adminId === adminId) {
        return true
    }

    throw new Error('User is nor your employee')
}

export default handleAdminThirdPartyDeleteOwnership