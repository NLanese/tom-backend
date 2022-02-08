import db from "../../generatePrisma.js";

// Want to change to checking the accident driver adminId and comparing
// it to the Managers Id. However, this works for now
const handleAdminAccidentOwnership = async (adminId, accidentId) => {
    let check = false

    const manager = await db.manager.findUnique({
        where: {
            id: adminId
        },
        include: {
            drivers: true
        }
    })
    
    if (!manager || !manager.drivers) {
        throw new Error("Error: there is no record of this manager!")
    }

    const accident = await db.accident.findUnique({
        where: {
            id: accidentId
        }
    })
    
    if (!accident) {
        throw new Error("Error: there is no record of this accident")
    }
    
    manager.drivers.forEach((driver) => {
        if (driver.id === accident.driverId) {
            check = true
        }
    })

    if (check === true) {
        return true
    }

    throw new Error("Error: you are not the administrator of the driver who owns this accident record")
}

export default handleAdminAccidentOwnership