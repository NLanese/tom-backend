import db from "../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Mutation :{
        assignDevice: async (_, {
            token,
            role,
            number,
            name,
            type,
            driverId,
            dspId,
            id


        }, context) => {

            let owner = false
            let manager = false

            if (role === "OWNER"){
                owner = checkOwnerAuth(token)
            }
            else if(role === "MANAGER"){
                manager = checkManagerAuth(token)
            }
            else {
                throw new Error("No Access! Nice Try, noob")
            }

            // Determines if Valid 
            if (!manager && !owner){
                throw new Error("No owner or manager with the give crudentials found")
            }
            
            if (id < 0) {
                console.log(id)
                console.log("Error ASSIGNING the DEVICE")
                throw "Error ASSIGNING the DEVICE"
            }

            const findDevice = async (id) => {
                return db.device.findUnique({
                    where: {
                        id: id
                    }
                })
            }

            return findDevice(parseInt(id)).then( async (resolved) => {
                if (resolved === null){
                    console.log("Error matching ID")
                    throw "Device not found"
                }

                try{
                        return db.device.update({
                            where: {
                                id: resolved.id
                            },
                            data: {
                                number: number,
                                name: name, 
                                type: type,
                                driver: {
                                    connect: {
                                        id: driverId
                                    }
                                }
                                
                            },
                            include: {
                                dsp: true,
                                driver: true
                            }
                        })
                        // .then( async (resolved) => {
                        //     console.log(resolved)
                        //     return await db.device.findUnique({
                        //         where: {
                        //             id: resolved.id
                        //         },
                        //         include: {
                        //             dsp: true,
                        //             driver: true
                        //         }
                        //     })
                        // })
                        
                    } catch (error){
                        console.log(error)
                        throw new Error(error)
                }


            })

        }
    }
}