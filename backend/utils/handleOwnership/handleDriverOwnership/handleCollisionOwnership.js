import db from "../../generatePrisma.js"

const handleCollisionOwnership = async (driverId, thirdPartyId) => {
    const collision = await db.collision.findUnique({
        where: {
            id: thirdPartyId
        },
        include: {
            accident: {
                include: {
                    driver: true
                }
            }
        }
    })

    console.log(collision)

    if (!collision || !collision.accident || !collision.accident[0].driver) {
        throw new Error('Error: Accident record does not exist')
    }

    if (collision.accident[0].driver.id === driverId) {
        return true
    }

    throw new Error('Error: Not owner of Third Party report')
}

export default handleCollisionOwnership