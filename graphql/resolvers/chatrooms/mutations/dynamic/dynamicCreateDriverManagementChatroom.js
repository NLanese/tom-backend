import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-admin-auth.js";


export default {
    Mutation: {
        dynamicCreateDriverManagementChatroom: async (_, {
            role,
            driverId
        }, context) => {
            let owner;
            let manager;
            let guests = []

            // Dynamic authorization check
            if (role === 'OWNER') owner = await checkOwnerAuth(context)
            if (role === 'MANAGER') manager = await checkManagerAuth(context)

            const foundDriver = await db.driver.findUnique({
                where: {
                    id: driverId
                }
            })

            if (!foundDriver) throw new Error("Driver does not exist")
            guests.push(foundDriver)

            if (owner) {
                const foundOwner = await db.owner.findUnique({
                    where: {
                        id: owner.id
                    },
                    include: {
                        admins: true
                    }
                })

                foundOwner.admins.forEach((manager) => {
                    guests.push(manager)
                })

                try {
                    const newChatroom = await db.chatroom.create({
                        data: {
                            guests: [ ...guests ],
                            owner: {
                                connect: {
                                    id: owner.id
                                }
                            }
                        }
                    })

                    return await newChatroom
                } catch (error) {
                    console.log(error)
                    throw new Error(error)
                }
            }
        }
    }
}