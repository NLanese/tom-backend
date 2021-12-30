import db from "../../generatePrisma.js"

const handleInjuryAccidentOwnership = async (driverId, injuryAccidentId) => {
    const injuryAccident = await db.injuryAccident.findUnique({
        where: {
            id: injuryAccidentId
        },
        include: {
            accident: {
                include: {
                    driver: true
                }
            }
        }
    })

    if (!injuryAccident || !injuryAccident.accident || !injuryAccident.accident.driver) {
        throw new Error('Error: Accident record doesnt exist')
    }

    if (driverId === injuryAccident.accident[0].driver.id){
        return true
    }

    throw new Error("Error: Not injury accident owner")
}

export default handleInjuryAccidentOwnership