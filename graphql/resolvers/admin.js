import db from '../../utils/generatePrisma.js';
import bcrypt from 'bcryptjs';
import hashPassword from '../../utils/passwordHashing.js';
import generateAdminToken from '../../utils/generateToken/generateAdminToken.js';
import checkAdminAuth from '../../utils/checkAuthorization/check-admin-auth.js';
import { UserInputError } from 'apollo-server-errors';
import { validateRegisterInput, validateLoginInput } from '../../utils/validators.js';
import handleAdminUserOwnership from '../../utils/handleOwnership/handleAdminOwnership/handleAdminUserOwnership.js';

export default {
    Query: {
        getAdmin: async (_, {}, context) => {
            const admin = await checkAdminAuth(context)

            try {
                return await db.admin.findUnique({
                    where: {
                        id: admin.id
                    },
                    include: {
                        drivers: true
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        },

        adminGetEmployees: async (_, {}, context) => {
            const admin = await checkAdminAuth(context)
            try {
                return await db.driver.findMany({
                    where: {
                        adminId: admin.id,
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

        adminGetFiredEmployees: async (_, {}, context) => {
            const admin = await checkAdminAuth(context)
            try {
                return await db.driver.findMany({
                    where: {
                        adminId: admin.id,
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


        adminGetAccidentById: async (_, {
            accidentId
        }, context) => {
            const admin = await checkAdminAuth(context)
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
            const verified = handleAdminUserOwnership(admin.id, accident.driver.id)
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

        adminGetUserAccidentsById: async (_, {
            driverId
        }, context) => {
            const admin = await checkAdminAuth(context)
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
            const verified = await handleAdminUserOwnership(admin.id, driver.id)
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
        }
    },

    Mutation: {
        // ------ CREATE -------
        signupAdmin: async (_, {
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

                const admin = await db.admin.findUnique({
                    where: {
                        email
                    },
                });

                if (admin) {
                    throw new UserInputError('email is taken', {
                        errors: {
                            email: 'Email is already taken',
                        },
                    });
                }

                password = await hashPassword(password)

                return await db.admin.create({
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



        // ------ SIGN IN -------
        signinAdmin: async (_, {
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

            const foundUser = await db.admin.findUnique({
                where: {
                    email
                }
            })

            if (!foundUser) {
                errors.general = 'Driver not found';
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



        // ------ UPDATE -------
        updateAdmin: async (_, {
            email,
            firstname,
            lastname,
            password,
            phoneNumber
        }, context) => {
            const admin = await checkAdminAuth(context)

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
                if (!admin) {
                    errors.general = 'Driver not found';
                    throw new UserInputError('Driver not found', {
                        errors
                    });
                }

                return await db.admin.update({
                    where: {
                        id: admin.id
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



        // ------ UPDATE USER -------
        adminUpdateEmployeeByID: async (_, {
            driverId,
            adminEmail,
            adminFirstName,
            adminLastname,
            employeeId,
            phoneNumber,
            fico,
            netradyne,
            delivery_associate,
            seatbelt_off_rate,
            speeding_event_rate,
            defects,
            customer_delivery_feedback,
            delivered_and_recieved,
            delivery_completion_rate,
            photo_on_delivery,
            call_compliance,
            scan_compliance,
            has_many_accidents,
            belongs_to_team,
            attendance,
            productivity,
            rank,
            tier,
            delivered,
            key_focus_area,
            distractions_rate,
            following_distance_rate,
            signal_violations_rate,
            attended_delivery_accuracy,
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
                            delivery_associate: delivery_associate,
                            seatbelt_off_rate: seatbelt_off_rate,
                            speeding_event_rate: speeding_event_rate,
                            defects: defects,
                            customer_delivery_feedback: customer_delivery_feedback,
                            delivered_and_recieved: delivered_and_recieved,
                            delivery_completion_rate: delivery_completion_rate,
                            photo_on_delivery: photo_on_delivery,
                            call_compliance: call_compliance,
                            scan_compliance: scan_compliance,
                            has_many_accidents: has_many_accidents,
                            attendance: attendance,
                            belongs_to_team: belongs_to_team,
                            attendance: attendance,
                            productivity: productivity,
                            rank: rank,
                            tier: tier,
                            delivered: delivered,
                            key_focus_area: key_focus_area,
                            distractions_rate: distractions_rate,
                            following_distance_rate: following_distance_rate,
                            signal_violations_rate: signal_violations_rate,
                            attended_delivery_accuracy: attended_delivery_accuracy,
                            dnr: dnr,
                            pod_opps: pod_opps,
                            cc_opps: cc_opps
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        },

        adminSuspendUser: async (_, {
            driverId
        }, context) => {
            const admin = await checkAdminAuth(context)
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

        adminCreateDriverAccounts: async (_, {
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
            key_focus_area,
            fico,
            seatbelt_and_speeding,
            seatbelt_off_rate,
            speeding_event_rate,
            distractions_rate,
            following_distance_rate,
            signal_violations_rate,
            delivery_completion_rate,
            delivered_and_recieved,
            photo_on_delivery,
            call_compliance,
            scan_compliance,
            attended_delivery_accuracy,
            dnr,
            pod_opps,
            cc_opps
        }, context) => {
            try {
                const { valid, errors } = validateRegisterInput(email, password);
                const admin = await checkAdminAuth(context)
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(password, salt);
                password = hash;

                email = await email.toUpperCase()
				firstname = await firstname.toUpperCase()
				lastname = await lastname.toUpperCase()
				adminEmail = await adminEmail.toUpperCase()

				const foundAdmin = await db.admin.findUnique({
					where: {
						id: admin.id
					}
				})

				if (!foundAdmin) {
					throw new Error('Error: Admin does not exist')
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
                            key_focus_area: key_focus_area,
                            fico: fico,
                            seatbelt_and_speeding: seatbelt_and_speeding,
                            speeding_event_rate: speeding_event_rate,
                            seatbelt_off_rate: seatbelt_off_rate,
                            distractions_rate: distractions_rate,
                            following_distance_rate: following_distance_rate,
                            signal_violations_rate: signal_violations_rate,
                            delivery_completion_rate: delivery_completion_rate,
                            delivered_and_recieved: delivered_and_recieved,
                            photo_on_delivery: photo_on_delivery,
                            call_compliance: call_compliance,
                            scan_compliance: scan_compliance,
                            attended_delivery_accuracy: attended_delivery_accuracy,
                            dnr: dnr,
                            pod_opps: pod_opps,
                            cc_opps: cc_opps
                        },
                    });
				};

                return await db.driver.create({
					data: {
						admin: {
							connect: {
								id: admin.id
							}
						},
						email: email,
						password: password,
						firstname: firstname,
						lastname: lastname,
						phoneNumber: phoneNumber,
						adminEmail: foundAdmin.email,
						adminFirstname: foundAdmin.firstname,
						adminLastname: foundAdmin.lastname,
						adminPhoneNumber: foundAdmin.phoneNumber,
						dsp_name: foundAdmin.dsp_name,
						dsp_shortcode: foundAdmin.dsp_shortcode,
                        rank: rank,
                        employeeId: employeeId,
                        tier: tier,
                        delivered: delivered,
                        key_focus_area: key_focus_area,
                        fico: fico,
                        seatbelt_and_speeding: seatbelt_and_speeding,
                        speeding_event_rate: speeding_event_rate,
                        seatbelt_off_rate: seatbelt_off_rate,
                        distractions_rate: distractions_rate,
                        following_distance_rate: following_distance_rate,
                        signal_violations_rate: signal_violations_rate,
                        delivery_completion_rate: delivery_completion_rate,
                        delivered_and_recieved: delivered_and_recieved,
                        photo_on_delivery: photo_on_delivery,
                        call_compliance: call_compliance,
                        scan_compliance: scan_compliance,
                        attended_delivery_accuracy: attended_delivery_accuracy,
                        dnr: dnr,
                        pod_opps: pod_opps,
                        cc_opps: cc_opps
					},
				});
            } catch (error) {
                console.log(error)
                throw new Error(error)
            }
        }
    }
}