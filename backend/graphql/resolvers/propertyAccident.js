import checkAuth from '../../utils/check-auth.js';
import db from '../../utils/generatePrisma.js';

export default{
    Mutation: {
        createPropertyAccident: async (_, {accidentId, self_injured, vehicle_number, amazon_logo, exact_address, action_before_accident, police_report, weather, wet_ground, slippery_ground, extra_info, rushed_prior  }, context) => {
            const user = await checkAuth(context)

            try{
                return db.propertyAccident.create({
                    data: {
                        accident: {
                            connect: {
                                id: accidentId
                            }
                        },
                        self_injured: self_injured,
                        vehicle_number: vehicle_number,
                        amazon_logo: amazon_logo,
                        exact_address: exact_address,
                        action_before_accident: action_before_accident,
                        police_report: police_report, 
                        weather: weather,
                        wet_ground: wet_ground,
                        slippery_ground: slippery_ground,
                        extra_info: extra_info,
                        rushed_prior: rushed_prior
                    }
                })
            }catch(error){
                throw new Error(error)
            }
        },

        updatePropertyAccident:  async (_, { self_injured, vehicle_number, amazon_logo, exact_address, action_before_accident, police_report, weather, wet_ground, slippery_ground, extra_info, rushed_prior  }, context) => {
            const user = await checkAuth(context)

            try{
                return db.propertyAccident.update({
                    data: {
                        self_injured: self_injured,
                        vehicle_number: vehicle_number,
                        amazon_logo: amazon_logo,
                        exact_address: exact_address,
                        action_before_accident: action_before_accident,
                        police_report: police_report, 
                        weather: weather,
                        wet_ground: wet_ground,
                        slippery_ground: slippery_ground,
                        extra_info: extra_info,
                        rushed_prior: rushed_prior
                    }
                })
            }catch(error){
                throw new Error(error)
            }
        }
    }
}