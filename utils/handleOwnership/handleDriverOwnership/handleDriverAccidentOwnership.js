import db from "../../generatePrisma.js";

const handleDriverAccidentOwnership = async (driverId, accidentId) => {
    const foundAccident = await db.accident.findUnique({
        where: {
            id: accidentId
        }
    })

    if (!foundAccident) {
        throw new Error("Accident not found")
    }

    if (driverId === foundAccident.driverId) {
        return
    }

    throw new Error('Not your accident')
}

export default handleDriverAccidentOwnership