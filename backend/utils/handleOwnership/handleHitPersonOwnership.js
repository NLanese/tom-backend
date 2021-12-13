import db from "../generatePrisma.js"

export const handleHitPersonOwnership = async (userId, hitPersonId) => {
    const hitPerson = await db.hitPerson.findUnique({
        where: {
            id: hitPersonId
        },
        include: {
            accident: true
        }
    })

    if (hitPerson.accident.user.id === userId){
        console.log("hit")
        return true
    }

    throw new Error("Error: not owner of accident details")
}