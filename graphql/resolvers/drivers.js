import bcrypt from 'bcryptjs';
import hashPassword from '../../utils/passwordHashing.js';
import generateUserToken from '../../utils/generateToken/generateDriverToken.js';
import checkAdminAuth from '../../utils/checkAuthorization/check-admin-auth.js';
import checkDriverAuth from '../../utils/checkAuthorization/check-driver-auth.js';
import { UserInputError } from 'apollo-server-errors';
import { validateRegisterInput,	validateLoginInput } from '../../utils/validators.js';
import db from '../../utils/generatePrisma.js';
import handleAdminUserOwnership from '../../utils/handleOwnership/handleAdminOwnership/handleAdminUserOwnership.js'



export default {
	Query: {
		getDriver: async (_, {}, context) => {
			const driver = await checkDriverAuth(context)

			try {
				return await db.driver.findUnique({
					where: {
						id: driver.id
					},
					include: {
						admin: true,
						accidents: {
							include: {
								hitPerson: true,
								collision: true,
								injuryAccident: true,
								propertyAccident: true,
								injuryReport: true,
							}
						},
						vehicle: true,
						messages: true,
						notifiedMessages: true
					}
				})
			} catch (error) {
				throw new Error(error)
			}
		},

		getDriverById: async (_, {
			driverId
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
					return await db.driver.findUnique({
						where: {
							id: driverId
						},
						include: {
							accidents: {
								include: {
									hitPerson: true,
									collision: true,
									injuryAccident: true,
									propertyAccident: true,
									injuryReport: true,
									vehicle:	true
								}
							}
						}
					})
				}
			} catch (error) {
				throw new Error(error)
			}
		},

		getDriversForDspForSafetyAndCompliance: async (_, {}, context) => {
			const driver = await checkDriverAuth(context)

			const foundDriver = await db.driver.findUnique({
				where: {
					id: driver.id
				}
			})

			if (!foundDriver) {
				throw new Error('Error: Driver does not exist')
			}

			const drivers = await db.driver.findMany({
				where: {
					dsp_name: foundDriver.dsp_name
				},
				orderBy: [
					{
						fico: 'desc'
					},
					{
						netradyne: 'asc'
					}
				]
			})

			if (!drivers) {
				throw new Error('Error: No drivers with dsp name')
			}

			try {
				return drivers
			} catch (error) {
				throw new Error(error)
			}
		},

		getDriversForDspForTeam: async (_, {}, context) => {
			const driver = await checkDriverAuth(context)

			const foundDriver = await db.driver.findUnique({
				where: {
					id: driver.id
				}
			})

			if (!foundDriver) {
				throw new Error('Error: Driver does not exist')
			}

			const drivers = await db.driver.findMany({
				where: {
					dsp_name: foundDriver.dsp_name
				},
				orderBy: [
					{
						defects: 'asc'
					},
					{
						customer_delivery_feedback: 'desc'
					}
				]
			})

			if (!drivers) {
				throw new Error('Error: No drivers with dsp name')
			}

			try {
				return drivers
			} catch (error) {
				throw new Error(error)
			}
		},

		getDriversForScorecardQuality: async (_, {}, context) => {
			const driver = await checkDriverAuth(context)

			const foundDriver = await db.driver.findUnique({
				where: {
					id: driver.id
				}
			})

			if (!foundDriver) {
				throw new Error('Error: Driver does not exist')
			}

			const drivers = await db.driver.findMany({
				where: {
					dsp_name: foundDriver.dsp_name
				},
				orderBy: [
					{
						delivery_completion_rate: 'desc'
					},
					{
						delivered_and_recieved: 'desc'
					},
					{
						photo_on_delivery: 'desc'
					}
				]
			})

			if (!drivers) {
				throw new Error('Error: No drivers with dsp name')
			}

			try {
				return drivers
			} catch (error) {
				throw new Error(error)
			}
		}
	},

	Mutation: {
		/**
		 *
		 * @param {_} parent
		 * @param { email, password  } param1
		 * @returns Signed up driver in DB
		 */

		signupDriver: async (_, {
			signupInput: {
				email,
				password,
				firstname,
				lastname,
				phoneNumber,
				adminEmail
			}
		}) => {
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
				adminEmail = await adminEmail.toUpperCase()

				const foundAdmin = await db.admin.findUnique({
					where: {
						email: adminEmail
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

				if (driver) {
					throw new UserInputError('email is taken', {
						errors: {
							email: 'Email is already taken',
						},
					});
				}

				password = await hashPassword(password)

				return await db.driver.create({
					data: {
						admin: {
							connect: {
								id: foundAdmin.id
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
					},
				});
			} catch (error) {
				throw new Error(error);
			}
		},

		signinDriver: async (_, {
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
				throw new userInputError('Errors', {
					errors
				});
			}

			email = await email.toUpperCase()

			const foundUser = await db.driver.findUnique({
				where: {
					email,
				},
			});

			if (!foundUser) {
				errors.general = 'Driver not found';
				throw new UserInputError('Incorrect Email', {
					errors
				});
			}

			const isValid = await bcrypt.compare(password, foundUser.password);

			if (!isValid) {
				errors.general = 'Incorrect Password';
				throw new UserInputError('Incorrect Password', {
					errors
				});
			}

			const token = await generateUserToken(foundUser.id);

			req.session = {
				token: `Bearer ${token}`
			};

			return {
				...foundUser,
				token: token
			};
		},

		updateDriver: async (_, {
			updateDriver: {
				email,
				firstname,
				lastname,
				password,
				phoneNumber,
				fico,
				netradyne,
				delivery_associate,
				seatbelt,
				speeding,
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
				accidents
			}
		}, context) => {
			const driver = await checkDriverAuth(context);

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
				if (!driver) {
					errors.general = 'Driver not found';
					throw new UserInputError('Driver not found', {
						errors
					});
				}

				const newUser = await db.driver.update({
					where: {
						id: driver.id
					},
					data: {
						email: email,
						firstname: firstname,
						lastname: lastname,
						phoneNumber: phoneNumber,
						password: password,
						fico: fico,
						netradyne: netradyne,
						delivery_associate: delivery_associate,
						seatbelt: seatbelt,
						speeding: speeding,
						defects: defects,
						customer_delivery_feedback: customer_delivery_feedback,
						delivered_and_recieved: delivered_and_recieved,
						delivery_completion_rate: delivery_completion_rate,
						photo_on_delivery: photo_on_delivery,
						call_compliance: call_compliance,
						scan_compliance: scan_compliance,
						has_many_accidents: has_many_accidents,
						belongs_to_team: belongs_to_team,
						attendance: attendance,
						productivity: productivity,
						accidents: accidents
					}
				});

				return newUser;

			} catch (error) {
				throw new Error(error);
			}
		},

		/* NOT SURE IF NEEDED */
		deleteDriver: async (_, {
			driverId
		}, context) => {
			const admin = await checkAdminAuth(context);




			try {

			} catch (error) {
				throw new Error(error);
			}
		}
	},
};