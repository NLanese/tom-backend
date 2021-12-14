import db from "../generatePrisma.js";

const handleAdminAccidentDeleteOwnership = async (adminId, accidentId) => {
    let check = false
    const admin = await db.admin.findUnique({
        where: {
            id: adminId
        },
        include: {
            users: true
        }
    })

    const accident = await db.accident.findUnique({
        where: {
            id: accidentId
        },
        include: {
            user: true
        }
    })

    if (!accident) {
        throw new Error('Error: Accident record does not exist')
    }
    
    if (!admin) {
        throw new Error('Admin does not exist')
    }

    admin.users.forEach((user) => {
        if (user.id === accident.userId) {
            check = true
        } 
    })

    if (check === true) {
        return true
    }

    throw new Error('User is not your employee')
}

export default handleAdminAccidentDeleteOwnership