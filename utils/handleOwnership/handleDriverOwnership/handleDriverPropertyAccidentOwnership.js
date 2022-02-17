import db from "../../generatePrisma.js";

const handleDriverPropertyAccidentOwnership = async (driverId, propertyAccidnetId) => {
    const foundPropertyAccident = await db.propertyAccident.findUnique({
        where: {
            id: propertyAccidnetId
        },
        include: {
            accident: true
        }
    })

    if (!foundPropertyAccident) {
        throw new Error("Property Accident not found")
    }

    if (driverId === foundPropertyAccident.accident[0].driverId) {
        return
    }

    throw new Error('Not your accident')
}

export default handleDriverPropertyAccidentOwnership