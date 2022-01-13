import db from "../../generatePrisma.js"

const handleAccidentOwnership = async (driverId, accidentId) => {
    const accident = await db.accident.findUnique({
        where: {
            id: accidentId
        },
        include: {
            driver: true
        }
    })

    if (!accident) {
        throw new Error('Error: Accident record does not exist')
    }

    if (accident.driver.id === driverId) {
        return true
    }

    throw new Error('Error: Not owner of accident record')
}

export default handleAccidentOwnership