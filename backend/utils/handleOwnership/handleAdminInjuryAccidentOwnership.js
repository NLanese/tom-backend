import db from "../generatePrisma.js";


const handleAdminInjuryAccidentOwnership = async (adminId, injuryAccidentId) => {
    const injuryAccident = await db.injuryAccident.findUnique({
        where: {
            id: injuryAccidentId
        }
    })
    if (!injuryAccident){
        throw new Error("Error: Injury Accident does not exist!")
    }

    const accident = await db.accident.findUnique({
        where: {
            id: injuryAccident.accidentId
        },
        include: {
            user: true
        }
    })

    if (!accident || !accident.user){
        throw new Error("Something whent wrong! The Injury Accident does not appear linked to an accident or a user")
    }

    if (accident.user.adminId === adminId){
        return true
    }

    throw new Error("Error: You are not the admin of the Injury Accident's User")
}


export default handleAdminInjuryAccidentOwnership