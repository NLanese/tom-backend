import db from "../../generatePrisma.js";

const handleManagerDriverOwnership = async (managerId, driverId) => {
    let check = false

    const foundDriver = await db.driver.findUnique({
        where: {
            id: driverId
        },
        include: {
            managers: true
        }
    })

    foundDriver.managers.forEach((driverManager) => {
        if (driverManager.id === managerId) {
            check = true
        }
    })

    if (check === true) {
        return
    }

    throw new Error("Driver is not your employee")
}

export default handleManagerDriverOwnership