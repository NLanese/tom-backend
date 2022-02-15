import db from "../../generatePrisma.js";

const handleOwnerDriverOwnership = async (ownerId, driverId) => {
    const foundDriver = await db.driver.findUnique({
        where: {
            id: driverId
        }
    })

    if (foundDriver.ownerId === ownerId) {
        return
    }

    throw new Error("Driver is not your employee")
}

export default handleOwnerDriverOwnership