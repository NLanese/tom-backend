import db from '../../utils/generatePrisma.js';

export default {
    Query: {

    },

    Mutation: {
        suspendAdmin: async (_, {
            adminId
        }, context) => {
            // const superUser = await checkSuperAuth(context)
            try{
                if (true){
                    await db.user.updateMany({
                        where: {
                            adminId: adminId
                        },
                        data: {
                            adminAccountStanding: "Suspended"
                        }
                    })
                    return await db.admin.update({
                        where: {
                            id: adminId
                        },
                        data: {
                            accountStatus: "Suspended"
                        },
                        include: {
                            users: true
                        }
                    })
                }
            } catch(error){
                console.log(error)
                throw new Error(error)
            }
        }
    }
}