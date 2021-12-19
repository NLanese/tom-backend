import db from "../../generatePrisma.js";

const handleAdminUserOwnership = async (adminId, userId) => {
    const user = await db.user.findUnique({
        where: {
            id: userId
        }
    })
    
    if (!user) {
        throw new Error('Error: User does not exist')
    }

    if (user.adminId === adminId) {
        return true
    }

    throw new Error('Error: User is not your employee')
}

export default handleAdminUserOwnership