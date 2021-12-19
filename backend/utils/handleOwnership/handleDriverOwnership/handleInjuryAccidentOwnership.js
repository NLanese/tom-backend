import db from "../../generatePrisma.js"

const handleInjuryAccidentOwnership = async (userId, injuryAccidentId) => {
    const injuryAccident = await db.injuryAccident.findUnique({
        where: {
            id: injuryAccidentId
        },
        include: {
            accident: {
                include: {
                    user: true
                }
            }
        }
    })

    if (!injuryAccident || !injuryAccident.accident || !injuryAccident.accident.user) {
        throw new Error('Error: Accident record doesnt exist')
    }

    if (userId === injuryAccident.accident[0].user.id){
        return true
    }

    throw new Error("Error: Not injury accident owner")
}

export default handleInjuryAccidentOwnership