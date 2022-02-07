import db from "../../../../utils/generatePrisma.js";
import checkAdminAuth from "../../../../utils/checkAuthorization/check-admin-auth.js";

export default {
    Query: {
        getManager: async (_, {}, context) => {
            const admin = await checkAdminAuth(context)

            try {
                return await db.admin.findUnique({
                    where: {
                        id: admin.id
                    },
                    include: {
                        owner: true,
                        drivers: true,
                        dsp: true,
                        messages: true,
                        chatrooms: {
                            include: {
                                owner: true,
                                managers: true,
                                drivers: true,
                                messages: true
                            }
                        }
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}