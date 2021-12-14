import db from "../generatePrisma.js"

export const handleInjuryAccidentOwnership = async (userId, injuryAccidentId) => {
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

    if (!injuryAccident) {
        throw new Error('Accident record doesnt exist')
    }

    if (userId === injuryAccident.accident[0].user.id){
        return true
    }

    throw new Error("Error: Not injury accident owner")
}