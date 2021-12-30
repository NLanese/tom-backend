import db from "../../generatePrisma.js"

const handleCollisionOwnership = async (driverId, collisionId) => {
    const collision = await db.collision.findUnique({
        where: {
            id: collisionId
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