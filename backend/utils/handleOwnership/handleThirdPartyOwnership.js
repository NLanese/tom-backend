import db from "../generatePrisma.js"

export const handleThirdPartyOwnership = async (userId, thirdPartyId) => {
    const thirdParty = await db.thirdParty.findUnique({
        where: {
            id: thirdPartyId
        },
        include: {
            accident: {
                include: {
                    user: true
                }
            }
        }
    })

    if (!thirdParty) {
        throw new Error('Error: Accident record does not exist')
    }

    if (thirdParty.accident[0].user.id === userId) {
        return true
    }

    throw new Error('Error: Not owner of Third Party report')
}

export default handleThirdPartyOwnership