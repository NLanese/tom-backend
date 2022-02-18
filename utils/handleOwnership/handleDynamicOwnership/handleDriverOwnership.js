import db from "../../generatePrisma.js";

const handleDriverOwnership = async (role, id, driverId) => {
    const foundDriver = await db.driver.findUnique({
        where: {
            id: driverId
        }
    })

    if (!foundDriver) {
        throw new Error('Driver does not exist')
    }

    if (role === "OWNER") {
        if (foundDriver.ownerId === id) {
            return
        }
    }

    if (role === "MANAGER") {
        const foundManager = await db.manager.findUnique({
            where: {
                id: id
            }
        })

        if (foundManager.ownerId === foundDriver.ownerId) {
            return
        }
    }

    throw new Error("Driver is not your employee")
}

export default handleDriverOwnership