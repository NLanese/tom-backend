import db from "../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";

export default {
    Mutation: {
        ownerChangePaymentStatus: async (_, {
            subscriptionToken,
            subscriptionStartDate,
            subscriptionEndDate,
            stripeCustomerId,
            token
        }) => {

            // Finds Owner
            const owner = await checkOwnerAuth(token)

            // NO Owner
            if (!owner) {
                errors.general = 'Owner not found';
                throw new UserInputError('Owner not found', {
                    errors
                });
            }

            // Owner Exists
            else{
                const dsp = await db.dsp.update({
                    where: {
                        id: owner.dsp.id
                    },
                    data: {
                        subscriptionEndDate: subscriptionEndDate,
                        subscriptionStartDate: subscriptionStartDate,
                        sub,scriptionToken: subscriptionToken,
                        stripeCustomerId: stripeCustomerId
                    }
                })
                return dsp
            }
        }
    }
}