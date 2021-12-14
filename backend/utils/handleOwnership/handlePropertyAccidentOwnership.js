import db from "../generatePrisma.js"

export const handlePropertyAccidentOwnership = async (userId, propertyAccidentId) => {
    const propertyAccident = await db.propertyAccident.findUnique({
        where: {
            id: propertyAccidentId
        },
        include: {
            accident: {
                include: {
                    user: true
                }
            }
        }
    })

    if (!propertyAccident) {
        throw new Error('Error: Accident record does not exist')
    }

    if (propertyAccident.accident[0].user.id === userId) {
        return true
    }

    throw new Error('Error: Not owner of Property Accident report')
}