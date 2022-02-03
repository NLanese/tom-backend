import db from "../../generatePrisma.js";

const handleAdminUserOwnership = async (adminId, driverId) => {
    const driver = await db.driver.findUnique({
        where: {
            id: driverId
        }
    })
    
    if (!driver) {
        throw new Error('Error: Driver does not exist')
    }

    if (driver.adminId === adminId) {
        return true
    }

    throw new Error('Error: Driver is not your employee')
}

export default handleAdminUserOwnership