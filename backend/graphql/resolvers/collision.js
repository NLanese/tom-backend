import checkAdminAuth from '../../utils/checkAuthorization/check-admin-auth.js';
import checkUserAuth from '../../utils/checkAuthorization/check-driver-auth.js';
import db from '../../utils/generatePrisma.js';
import handleAccidentOwnership from '../../utils/handleOwnership/handleDriverOwnership/handleAccidentOwnership.js';
import handleAdminCollisionOwnership from '../../utils/handleOwnership/handleAdminOwnership/handleAdminCollisionOwnership.js';
import handleCollisionOwnership from '../../utils/handleOwnership/handleDriverOwnership/handleCollisionOwnership.js';

export default {
    Mutation: {
        createCollision: async (_, {
            accidentId,
            location
        }, context) => {
            const driver = await checkUserAuth(context)
            const verified = await handleAccidentOwnership(driver.id, accidentId)

            try {
                if (verified) {
                    return await db.collision.create({
                        data: {
                            location: location,
                            accidentId: accidentId,
                            accident: {
                                connect: {
                                    id: accidentId
                                }
                            },
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        },

        updateCollision: async (_, {
            collisionId,
            location
        }, context) => {
            const driver = await checkUserAuth(context)

            const collision = await db.collision.findUnique({
                where: {
                    id: collisionId
                }
            })

            if (!collision) {
                throw new Error('Error: Third party record does not exist')
            }

            const verified = await handleCollisionOwnership(driver.id, collisionId)

            try {
                if (verified) {
                    return await db.collision.update({
                        where: {
                            id: collisionId
                        },
                        data: {
                            location: location
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        },

        adminUpdateCollision: async (_, {
            collisionId,
            accidentId,
            location
        }, context) => {
            const admin = await checkAdminAuth(context)

            const thirdPartyRecord = await db.collision.findUnique({
                where: {
                    id: collisionId
                }
            })

            if (!thirdPartyRecord) {
                throw new Error('Error: Third party record does not exist')
            }

            const verified = await handleAdminCollisionOwnership(admin.id, collisionId, accidentId)

            try {
                if (verified) {
                    return await db.collision.update({
                        where: {
                            id: collisionId
                        },
                        data: {
                            location: location
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        },

        deleteCollision: async (_, {
            collisionId
        }, context) => {
            const admin = await checkAdminAuth(context)

            const collision = await db.collision.findUnique({
                where: {
                    id: collisionId
                }
            })

            if (!collision) {
                throw new Error('Error: Third party record does not exist')
            }

            const verified = await handleAdminCollisionOwnership(admin.id, collisionId)

            await db.collision.update({
                where: {
                    id: collisionId
                },
                data: {
                    deleted: true
                }
            })

            try {
                if (verified) {
                    return await db.collision.delete({
                        where: {
                            id: collisionId
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    },
}