import db from "../../generatePrisma.js"

const handleHitPersonOwnership = async (driverId, hitPersonId) => {
    const hitPerson = await db.hitPerson.findUnique({
        where: {
            id: hitPersonId
        },
        include: {
            accident: {
                include: {
                    driver: true
                }
            }
        }
    })

    if (!hitPerson || !hitPerson.accident || !hitPerson.accident.driver) {
        throw new Error('Error: Accident record does not exist')
    }

    if (hitPerson.accident[0].driver.id === driverId){
        return true
    }

    throw new Error("Error: Not owner of accident record")
}

export default handleHitPersonOwnership