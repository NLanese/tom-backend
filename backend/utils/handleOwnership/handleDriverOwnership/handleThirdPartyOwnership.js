import db from "../../generatePrisma.js"

const handleThirdPartyOwnership = async (userId, thirdPartyId) => {
    const collision = await db.collision.findUnique({
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

    if (!collision || !collision.accident || !collision.accident.user) {
        throw new Error('Error: Accident record does not exist')
    }

    if (collision.accident[0].user.id === userId) {
        return true
    }

    throw new Error('Error: Not owner of Third Party report')
}

export default handleThirdPartyOwnership