import db from "../../../../../../utils/generatePrisma.js"
import checkDriverAuth from "../../../../../../utils/checkAuthorization/check-driver-auth.js"
import handleDriverAccidentOwnership from "../../../../../../utils/handleOwnership/handleDriverOwnership/handleDriverAccidentOwnership.js"

export default {
    Mutation: {
        driverCreatePropertyAccident: async (_, {
            accidentId,
            contact_info,
            damage_report,
            defective_equip,
            safety_equip,
            extra_info,
            specific_pictures,
            package_report,
            types_of_damage
        }, context) => {
            const driver = await checkDriverAuth(context)
            
            const foundAccident = await db.accident.findUnique({
                where: {
                    id: accidentId
                }
            })

            if (!foundAccident) {
                throw new Error("Accident does not exist")
            }

            await handleDriverAccidentOwnership(driver.id, accidentId)

            try {
                console.log("about to try.....\n---------")
                return await db.propertyAccident.create({
                    data: {
                        contact_info: contact_info,
                        damage_report: damage_report,
                        defective_equip: defective_equip,
                        safety_equip: safety_equip,
                        extra_info: extra_info,
                        specific_pictures: specific_pictures,
                        package_report: package_report,
                        types_of_damage: types_of_damage,
                        // accidentId: foundAccident.id,
                        accident: {
                            connect: {
                                id: foundAccident.id
                            }
                        },
                    }
                })
            } catch (error) {
                console.log(error)
                throw new Error(error)
            }
        }
    }
}