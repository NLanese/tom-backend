import db from "../generatePrisma.js"

export const handleInjuryAccidentOwnership = (userId, injuryAccidentId) => {
    const injuryAccident = await db.injuryAccident.findUnique({
        where: {
            id: injuryAccidentId
        },
        include: {
            accident: true
        }
    })

    if (userId === injuryAccident.accident.user.id){
        return true
    }

    throw new Error("Error: not injury accident owner")
}