import db from "../generatePrisma.js"

export const handlePropertyAccidentOwnership = async (userId, propertyAccidentId) => {
    const propertyAccident = await db.propertyAccident.findUnique({
        where: {
            id: propertyAccidentId
        },
        include: {
            accident: true
        }
    })

    if (propertyAccident.accident.user.id === userId) {
        return true
    }

    throw new Error('Not accident owner')
}