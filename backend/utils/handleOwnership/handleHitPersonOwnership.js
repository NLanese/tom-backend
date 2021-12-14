import db from "../generatePrisma.js"

export const handleHitPersonOwnership = async (userId, hitPersonId) => {
    const hitPerson = await db.hitPerson.findUnique({
        where: {
            id: hitPersonId
        },
        include: {
            accident: {
                include: {
                    user: true
                }
            }
        }
    })

    if (!hitPerson) {
        throw new Error('Accident record does not exist')
    }

    if (hitPerson.accident[0].user.id === userId){
        return true
    }

    throw new Error("Error: Not owner of accident record")
}