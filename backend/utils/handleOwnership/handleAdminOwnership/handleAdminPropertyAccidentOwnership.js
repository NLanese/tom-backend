import db from "../../generatePrisma.js";

const handleAdminPropertyAccidentOwnership = async (adminId, propertyAccidentId) => {
    const propertyAccident = await db.propertyAccident.findUnique({
         where: {
             id: propertyAccidentId
         }
    })

    if (!propertyAccident) {
         throw new Error('Error: Property accident does not exist')
    }

    const accident = await db.accident.findUnique({
        where: {
            id: propertyAccident.accidentId
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

export default handleAdminPropertyAccidentOwnership