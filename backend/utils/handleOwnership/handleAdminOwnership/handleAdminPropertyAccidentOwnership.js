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
            user: true
        }
    })

    if (!accident || !accident.user) {
        throw new Error('Error: Accident record does not exist')
    }

    if (accident.user.adminId === adminId) {
        return true
    }

    throw new Error('Error: User is nor your employee')

}

export default handleAdminPropertyAccidentOwnership