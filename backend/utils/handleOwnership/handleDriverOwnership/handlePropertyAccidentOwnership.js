import db from "../../generatePrisma.js"

const handlePropertyAccidentOwnership = async (driverId, propertyAccidentId) => {
    const propertyAccident = await db.propertyAccident.findUnique({
        where: {
            id: propertyAccidentId
        },
        include: {
            accident: {
                include: {
                    driver: true
                }
            }
        }
    })

    if (!propertyAccident || !propertyAccident.accident || !propertyAccident.accident.driver) {
        throw new Error('Error: Accident record does not exist')
    }

    if (propertyAccident.accident[0].driver.id === driverId) {
        return true
    }

    throw new Error('Error: Not owner of Property Accident report')
}

export default handlePropertyAccidentOwnership