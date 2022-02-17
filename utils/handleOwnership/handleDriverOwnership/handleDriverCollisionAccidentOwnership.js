import db from "../../generatePrisma.js";

const handleDriverCollisionAccidentOwnership = async (driverId, collisionAccidentId) => {
    const foundCollisionAccident = await db.collisionAccident.findUnique({
        where: {
            id: collisionAccidentId
        },
        include: {
            accident: true
        }
    })

    if (!foundCollisionAccident) {
        throw new Error("Collision Accident not found")
    }

    if (driverId === foundCollisionAccident.accident[0].driverId) {
        return
    }

    throw new Error('Not your accident')
}

export default handleDriverCollisionAccidentOwnership