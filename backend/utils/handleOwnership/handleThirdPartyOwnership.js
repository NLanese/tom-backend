import db from "../generatePrisma.js"

export const handleThirdPartyOwnership = async (userId, thirdPartyId) => {
    const thirdParty = await db.thirdParty.findUnique({
        where: {
            id: thirdPartyId
        },
        include: {
            accident: true
        }
    })

    if (thirdParty.accident.user.id === userId) {
        return true
    }

    throw new Error('Not accident owner')
}