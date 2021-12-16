import db from "../generatePrisma.js";

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
    const accident = await db.accident.findUnique({
        where: {
            id: accidentId
        }
    })
    if (!admin){
        throw new Error("Error: there is no record of this admin!")
    }
    if (!accident){
        throw new Error("Error: there is no record of this accident")
    }
    admin.users.forEach( (user) => {
        if (user.id === accident.userId){
            check = true
        }
    })
    if (check === true){
        return true
    }
    else{
        throw new Error("Error: you are not the administrator of the user who owns this accident record")
    }
}

export default handleAdminAccidentOwnership