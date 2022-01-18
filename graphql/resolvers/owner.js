import db from '../../utils/generatePrisma.js';
import bcrypt from 'bcryptjs';
import hashPassword from '../../utils/passwordHashing.js';
import generateAdminToken from '../../utils/generateToken/generateAdminToken.js';
import checkAdminAuth from '../../utils/checkAuthorization/check-admin-auth.js';
import { UserInputError } from 'apollo-server-errors';
import { validateRegisterInput, validateLoginInput } from '../../utils/validators.js';
import handleAdminUserOwnership from '../../utils/handleOwnership/handleAdminOwnership/handleAdminUserOwnership.js';

export default {
    Query:{
        getOwner: async (_, {}, context) => {
            const owner = await checkAdminAuth(context)

            try {
                return await db.owner.findUnique({
                    where: {
                        id: owner.id
                    },
                    include: {
                        drivers: true,
                        admins: true
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        },

        ownerGetDrivers: async (_, {}, context) => {
            const owner = await checkAdminAuth(context)
            try {
                return await db.driver.findMany({
                    where: {
                        ownerId: owner.id,
                        deleted: false
                    },
                    include: {
                        accidents: true
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        },

        ownerGetFiredDrivers: async (_, {}, context) => {
            const owner = await checkAdminAuth(context)
            try {
                return await db.driver.findMany({
                    where: {
                        ownerId: owner.id,
                        deleted: true
                    },
                    include: {
                        accidents: true
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        },

        ownerGetAdmins: async (_, {}, context) => {
            const owner = await checkAdminAuth(context)
            try {
                return await db.admin.findMany({
                    where: {
                        ownerId: owner.id,
                        deleted: false
                    },
                    include: {
                        drivers: true
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        },

        ownerGetFiredAdmins: async (_, {}, context) => {
            const owner = await checkAdminAuth(context)
            try {
                return await db.admin.findMany({
                    where: {
                        ownerId: owner.id,
                        deleted: true
                    },
                    include: {
                        drivers: true
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        },
        ownerGetAccidentById: async (_, {
            accidentId
        }, context) => {
            const owner = await checkAdminAuth(context)
            const accident = await db.accident.findUnique({
                where: {
                    id: accidentId
                },
                include: {
                    driver: true
                }
            })
            if (!accident) {
                throw new Error("Error: Accident does not exist")
            }
            const verified = handleAdminUserOwnership(owner.id, accident.driver.id)
            try {
                if (verified) {
                    return await db.accident.findUnique({
                        where: {
                            id: accidentId
                        },
                        include: {
                            driver: true,
                            collision: true,
                            hitPerson: true,
                            injuryAccident: true,
                            injuryReport: true,
                            propertyAccident: true
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        },
        ownerGetUserAccidentsById: async (_, {
            driverId
        }, context) => {
            const owner = await checkAdminAuth(context)
            const driver = await db.driver.findUnique({
                where: {
                    id: driverId
                },
                include: {
                    accidents: true
                }
            })
            if (!driver) {
                throw new Error('Error: Driver does not exist')
            }
            const verified = await handleAdminUserOwnership(owner.id, driver.id)
            if (verified) {
                try {
                    return await db.driver.findUnique({
                        where: {
                            id: driverId
                        },
                        include: {
                            accidents: true
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }
        },

    },
    Mutation:{
        signupOwner: async (_, {
            email,
            password,
            firstname,
            lastname,
            phoneNumber,
            dsp_name,
            dsp_shortcode
        }, context) => {
            try {
                const {
                    valid,
                    errors
                } = validateRegisterInput(
                    email,
                    password
                );

                email = await email.toUpperCase()
                firstname = await firstname.toUpperCase()
                lastname = await lastname.toUpperCase()
                dsp_name = await dsp_name.toUpperCase()
                dsp_shortcode = await dsp_shortcode.toUpperCase()

                if (!valid) {
                    throw new UserInputError('Errors', {
                        errors
                    })
                }

                const owner = await db.owner.findUnique({
                    where: {
                        email
                    },
                });

                if (owner) {
                    throw new UserInputError('email is taken', {
                        errors: {
                            email: 'Email is already taken',
                        },
                    });
                }

                password = await hashPassword(password)

                return await db.owner.create({
                    data: {
                        email: email,
                        password: password,
                        firstname: firstname,
                        lastname: lastname,
                        phoneNumber: phoneNumber,
                        dsp_name: dsp_name,
                        dsp_shortcode: dsp_shortcode
                    },
                });
            } catch (error) {
                throw new Error(error)
            }
        },
        signinOwner: async (_, {
            email,
            password
        }, {
            req
        }) => {
            const {
                errors,
                valid
            } = validateLoginInput(email, password);

            if (!valid) {
                throw new UserInputError('Errors', {
                    errors
                })
            }

            email = await email.toUpperCase()

            const foundUser = await db.owner.findUnique({
                where: {
                    email
                }
            })

            if (!foundUser) {
                errors.general = 'Account not found';
                throw new UserInputError('Incorrect Email', {
                    errors
                });
            }

            const isValid = await bcrypt.compare(password, foundUser.password)

            if (!isValid) {
                errors.general = 'Incorrect Password'
                throw new UserInputError('Incorrect Password', {
                    errors
                })
            }

            const token = await generateAdminToken(foundUser.id)

            req.session = {
                token: `Bearer ${token}`
            }

            return {
                ...foundUser,
                token: token
            }
        },
        updateOwner: async (_, {
            email,
            firstname,
            lastname,
            password,
            phoneNumber
        }, context) => {
            const owner = await checkAdminAuth(context)

            if (typeof password !== "undefined") {
                password = await hashPassword(password)
            }

            if (email) {
                email = email.toUpperCase()
            }

            if (firstname) {
                firstname = firstname.toUpperCase()
            }

            if (lastname) {
                lastname = lastname.toUpperCase()
            }

            try {
                if (!owner) {
                    errors.general = 'Driver not found';
                    throw new UserInputError('Driver not found', {
                        errors
                    });
                }

                return await db.owner.update({
                    where: {
                        id: owner.id
                    },
                    data: {
                        email: email,
                        firstname: firstname,
                        lastname: lastname,
                        password: password,
                        phoneNumber: phoneNumber
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        },
        ownerUpdateEmployeeByID: async (_, {
            driverId,
            adminEmail,
            adminFirstName,
            adminLastname,
            employeeId,
            phoneNumber,
            fico,
            netradyne,
            deliveryAssociate,
            seatbeltOffRate,
            speedingEventRate,
            defects,
            customerDeliveryFeedback,
            deliveredAndRecieved,
            deliveryCompletionRate,
            photoOnDelivery,
            callCompliance,
            scanCompliance,
            hasManyAccidents,
            belongsToTeam,
            attendance,
            productivity,
            rank,
            tier,
            delivered,
            keyFocusArea,
            distractionsRate,
            followingDistanceRate,
            signalViolationsRate,
            attendedDeliveryAccuracy,
            dnr,
            pod_opps,
            cc_opps
        }, context) => {
            const admin = await checkAdminAuth(context)
            const driver = await db.driver.findUnique({
                where: {
                    id: driverId
                }
            })

            if (!driver) {
                throw new Error('Error: Driver does not exist')
            }

            const verified = await handleAdminUserOwnership(admin.id, driverId)

            try {
                if (verified) {
                    return await db.driver.update({
                        where: {
                            id: driverId
                        },
                        data: {
                            adminEmail: adminEmail,
                            adminFirstName: adminFirstName,
                            adminLastname: adminLastname,
                            phoneNumber: phoneNumber,
                            employeeId: employeeId,
                            fico: fico,
                            netradyne: netradyne,
                            deliveryAssociate: deliveryAssociate,
                            seatbeltOffRate: seatbeltOffRate,
                            speedingEventRate: speedingEventRate,
                            defects: defects,
                            customerDeliveryFeedback: customerDeliveryFeedback,
                            deliveredAndRecieved: deliveredAndRecieved,
                            deliveryCompletionRate: deliveryCompletionRate,
                            photoOnDelivery: photoOnDelivery,
                            callCompliance: callCompliance,
                            scanCompliance: scanCompliance,
                            has_many_accidents: hasManyAccidents,
                            attendance: attendance,
                            belongs_to_team: belongsToTeam,
                            attendance: attendance,
                            productivity: productivity,
                            rank: rank,
                            tier: tier,
                            delivered: delivered,
                            key_focus_area: keyFocusArea,
                            distractions_rate: distractionsRate,
                            following_distance_rate: followingDistanceRate,
                            signal_violations_rate: signalViolationsRate,
                            attended_delivery_accuracy: attendedDeliveryAccuracy,
                            dnr: dnr,
                            pod_opps: pod_opps,
                            cc_opps: cc_opps
                        }
                    })
                }
            } catch (error) {
                console.log(error)
                throw new Error(error)
            }
        },
        ownerSuspendDriver: async (_, {
            driverId
        }, context) => {
            const owner = await checkAdminAuth(context)
            const verified = await handleAdminUserOwnership(admin.id, driverId)

            try {
                if (verified) {
                    return await db.driver.update({
                        where: {
                            id: driverId
                        },
                        data: {
                            deleted: true
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }

        },
        ownerCreateDriverAccounts: async (_, {
            email,
            password,
            firstname,
            lastname,
            phoneNumber,
            adminEmail,
            rank,
            employeeId,
            tier,
            delivered,
            keyFocusArea,
            fico,
            seatbeltOffRate,
            speedingEventRate,
            distractionsRate,
            followingDistanceRate,
            signalViolationsRate,
            deliveryCompletionRate,
            deliveredAndRecieved,
            photoOnDelivery,
            callCompliance,
            scanCompliance,
            attendedDeliveryAccuracy,
            dnr,
            pod_opps,
            cc_opps
        }, context) => {
            try {
                const { valid, errors } = validateRegisterInput(email, password);
                const owner = await checkAdminAuth(context)
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(password, salt);
                password = hash;

                email = await email.toUpperCase()
				firstname = await firstname.toUpperCase()
				lastname = await lastname.toUpperCase()
				adminEmail = await adminEmail.toUpperCase()

				const foundAdmin = await db.owner.findUnique({
					where: {
						id: owner.id
					}
				})

				if (!foundAdmin) {
					throw new Error('Error: Owner does not exist')
				}

				if (!valid) {
					throw new userInputError('Errors', {
						errors
					});
				}

				const driver = await db.driver.findUnique({
					where: {
						email,
					},
				});

				if (await driver && employeeId === driver.employeeId) {
					return await db.driver.update({
                        where: {
                            id: driver.id
                        },
                        data: {
                            email: email,
                            password: password,
                            firstname: firstname,
                            lastname: lastname,
                            phoneNumber: phoneNumber,
                            rank: rank,
                            employeeId: employeeId,
                            tier: tier,
                            delivered: delivered,
                            keyFocusArea: keyFocusArea,
                            fico: fico,
                            seatbeltAndSpeeding: seatbeltAndSpeeding,
                            speedingEventRate: speedingEventRate,
                            seatbeltOffRate: seatbeltOffRate,
                            distractionsRate: distractionsRate,
                            followingDistanceRate: followingDistanceRate,
                            signalViolationsRate: signalViolationsRate,
                            deliveryCompletionRate: deliveryCompletionRate,
                            deliveredAndRecieved: deliveredAndRecieved,
                            photoOnDelivery: photoOnDelivery,
                            callCompliance: callCompliance,
                            scanCompliance: scanCompliance,
                            attendedDeliveryAccuracy: attendedDeliveryAccuracy,
                            dnr: dnr,
                            pod_opps: pod_opps,
                            cc_opps: cc_opps
                        },
                    });
				};
    }
}