import db from "../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Mutation :{
        dynamicCreateOrUpdateDevice: async (_, {
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
                try{
                    return await db.device.create({
                        data: {
                            number: number,
                            name: name,
                            type: type,
                            dsp: {
                                connect: {
                                    id: dspId
                                }
                            }
                        },
                        include: {
                            dsp: true,
                        }
                    })
                    // .then( async (resolved) => {
                    //     console.log(resolved)
                    //     return await db.device.findUnique({
                    //         where: {
                    //             id: resolved.id
                    //         },
                    //         include: {
                    //             dsp: true
                    //         }
                    //     })
                    // })
                } catch (error){
                    console.log("Error CREATING the DEVICE")
                    console.log(error)
                    throw new Error(error)
                }

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
                    console.log('== update ==')
                    console.log(resolved)
                    console.log(name)
                        return db.device.update({
                            where: {
                                id: resolved.id
                            },
                            data: {
                                number: number,
                                name: name,
                                type: type,
                                
                            }
                        }).then( async (resolved) => {
                            console.log(resolved)
                            return await db.device.findUnique({
                                where: {
                                    id: resolved.id
                                },
                                include: {
                                    dsp: true
                                }
                            })
                        })
                        
                    } catch (error){
                        console.log("Error UPDATING the DEVICE")
                        console.log(error)
                        throw new Error(error)
                }


            })

        }
    }
}