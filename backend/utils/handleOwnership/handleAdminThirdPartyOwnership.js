import db from "../generatePrisma.js";

const handleAdminThirdPartyOwnership = async (adminId, thirdPartyId, accidentId) => {
    let returnedId;
    const accident = await db.accident.findUnique({
        where: {
            id: accidentId
        },
        include: {
            thirdParty: true
        }
    })

    if (!accident) {
        throw new Error("Error: Accident record does not exist")
    }

    const user = await db.user.findUnique({
        where: {
            id: accident.userId
        }
    })

    if (!user) {
        throw new Error('Error: User does not exist')
    }

    accident.thirdParty.forEach((thirdParty) => {
        if (thirdParty.id = thirdPartyId) {
            returnedId = thirdPartyId
        }
    })

    if (returnedId !== thirdPartyId) {
        throw new Error('Error: ThirdPartyId not the same as requested thirdPartyId')
    }

    if (accident.userId === user.id && adminId === user.adminId) {
        return accident.thirdParty[0].id
    }

    throw new Error('User is nor your employee')
}

export default handleAdminThirdPartyOwnership