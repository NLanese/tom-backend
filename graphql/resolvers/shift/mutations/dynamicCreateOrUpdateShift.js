import db from "../../../../utils/generatePrisma.js"
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Mutation :{
        dynamicCreateOrUpdateShift: async (_, {
            token,
            role,
            date,
            allDevices,
        }, context) => {

            // Determines if Owner or Manager
            let owner = false
            let manager = false
            if (role == "OWNER"){
                owner = checkOwnerAuth(token)
            }
            else if(role == "MANAGER"){
                manager = checkManagerAuth(token)
            }
            else {
                throw new Error("No Access! Nice Try, noob")
            }

            // Determines if Valid 
            if (!manager && !owner){
                throw new Error("No owner or manager with the give crudentials found")
            }

            console.log(date)

            const foundShift = db.shift.findUnique({
                where: {
                    date: date
                }
            })

            console.log(foundShift.id)

            if (foundShift.id){
                try{
                    let newShift = db.shift.update({
                        where: {
                            id: foundShift.id
                        },
                        data: {
                            allDevices: allDevices,
                            date: date
                        }
                    })
                    
                } catch (error){
                    console.log("Error UPDATING the SHIFT")
                    console.log(error)
                    throw new Error(error)
                }
            }
            else {
                try{
                    await db.shift.create({
                        data: {
                            allDevices: allDevices,
                            date: date
                        }
                    })
                    
                } catch (error){
                    console.log("Error CREATING the SHIFT")
                    console.log(error)
                    throw new Error(error)
                }
            }
            allDevices.forEach( async (deviceObj) => {
                for (let i = 0; i < deviceObj.amount; i++){
                    let thisDriver = db.driver.findUnique({
                        where: {
                            id: deviceObj[i].id
                        }
                    })
                    let allDriverShifts = thisDriver.shifts
                    let newShifts = allDriverShifts.filter( shift => {
                        if (shift.date != date){
                            return shift
                        }
                    })
                    newShifts = [...newShifts, {
                        date: date,
                        [deviceObj.name]: `${deviceObj.name}${i}`
                    }]
                    await db.driver.update({
                        where: {
                            id: thisDriver.id
                        },
                        data: {
                            shifts: newShifts
                        }
                    })
                }
            })

            return newShift
        }
    }
}