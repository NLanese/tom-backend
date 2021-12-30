import db from "../../generatePrisma.js";

const handleAdminCollisionOwnership = async (adminId, thirdPartyId) => {
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
            driver: true
        }
    })

    if (!accident || !accident.driver) {
        throw new Error('Error: Accident record does not exist')
    }

    if (accident.driver.adminId === adminId) {
        return true
    }

    throw new Error('Error: Driver is nor your employee')
}

export default handleAdminCollisionOwnership