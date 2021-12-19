import db from "../../generatePrisma.js";

// Want to change to checking the accident user adminId and comparing
// it to the Admins Id. However, this works for now
const handleAdminAccidentOwnership = async (adminId, accidentId) => {
    let check = false

    const admin = await db.admin.findUnique({
        where: {
            id: adminId
        },
        include: {
            users: true
        }
    })
    
    if (!admin || !admin.users) {
        throw new Error("Error: there is no record of this admin!")
    }

    const accident = await db.accident.findUnique({
        where: {
            id: accidentId
        }
    })
    
    if (!accident) {
        throw new Error("Error: there is no record of this accident")
    }
    
    admin.users.forEach((user) => {
        if (user.id === accident.userId) {
            check = true
        }
    })

    if (check === true) {
        return true
    }

    throw new Error("Error: you are not the administrator of the user who owns this accident record")
}

export default handleAdminAccidentOwnership