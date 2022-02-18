import db from "../../generatePrisma.js";

const handleDriverInjuryAccidentOwnership = async (driverId, injuryAccidentId) => {
    const foundInjuryAccident = await db.injuryAccident.findUnique({
        where: {
            id: injuryAccidentId
        },
        include: {
            accident: true
        }
    })

    if (!foundInjuryAccident) {
        throw new Error('Injury Accident not found')
    }

    const foundAccident = await db.accident.findUnique({
        where: {
            id: foundInjuryAccident.accidentId
        }
    })

    if (!foundAccident) {
        throw new Error('Accident does not exist')
    }

    if (driverId === foundAccident.driverId) {
        return
    }

    throw new Error('Not your accident')
}

export default handleDriverInjuryAccidentOwnership