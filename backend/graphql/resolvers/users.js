import bcrypt from 'bcryptjs';
import hashPassword from '../../utils/passwordHashing.js';
import generateUserToken from '../../utils/generateToken/generateUserToken.js';
import checkAdminAuth from '../../utils/checkAuthorization/check-admin-auth.js';
import checkUserAuth from '../../utils/checkAuthorization/check-user-auth.js';
import { UserInputError } from 'apollo-server-errors';
import { validateRegisterInput,	validateLoginInput } from '../../utils/validators.js';
import db from '../../utils/generatePrisma.js';
import handleAdminUserOwnership from '../../utils/handleOwnership/handleAdminOwnership/handleAdminUserOwnership.js'



export default {
	Query: {
		getUser: async (_, {}, context) => {
			const user = await checkUserAuth(context)

			try {
				return await db.user.findUnique({
					where: {
						id: user.id
					},
					include: {
						admin: true,
						accidents: {
							include: {
								hitPerson: true,
								collision: true,
								injuryAccident: true,
								propertyAccident: true,
								injuryReport: true
							}
						}
					}
				})
			} catch (error) {
				throw new Error(error)
			}
		},

		getUserById: async (_, {
			userId
		}, context) => {
			const admin = await checkAdminAuth(context)

			const user = await db.user.findUnique({
				where: {
					id: userId
				}
			})

			if (!user) {
				throw new Error('Error: User does not exist')
			}

			const verified = await handleAdminUserOwnership(admin.id, userId)

			try {
				if (verified) {
					return await db.user.findUnique({
						where: {
							id: userId
						},
						include: {
							accidents: {
								include: {
									hitPerson: true,
									collision: true,
									injuryAccident: true,
									propertyAccident: true,
									injuryReport: true
								}
							}
						}
					})
				}
			} catch (error) {
				throw new Error(error)
			}
		}
	},

	Mutation: {
		/**
		 *
		 * @param {_} parent
		 * @param { email, password, username } param1
		 * @returns Signed up user in DB
		 */

		signupUser: async (_, {
			signupInput: {
				email,
				password,
				username,
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
					username,
					email,
					password
				);

				email = await email.toUpperCase()
				username = await username.toUpperCase()
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

				const user = await db.user.findUnique({
					where: {
						email,
					},
				});

				if (user) {
					throw new UserInputError('email is taken', {
						errors: {
							email: 'Email is already taken',
						},
					});
				}

				const checkUsername = await db.user.findUnique({
					where: {
						username
					},
				});

				if (checkUsername) {
					throw new UserInputError('username is taken', {
						errors: {
							email: 'Username is already taken',
						},
					});
				}

				password = await hashPassword(password)

				return await db.user.create({
					data: {
						admin: {
							connect: {
								id: foundAdmin.id
							}
						},
						email: email,
						username: username,
						password: password,
						firstname: firstname,
						lastname: lastname,
						phoneNumber: phoneNumber,
						adminEmail: foundAdmin.email,
						adminFirstname: foundAdmin.firstname,
						adminLastname: foundAdmin.lastname,
						adminUsername: foundAdmin.username,
						dsp_name: foundAdmin.dsp_name,
						dsp_shortcode: foundAdmin.dsp_shortcode
					},
				});
			} catch (error) {
				throw new Error(error);
			}
		},

		signinUser: async (_, {
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

			const foundUser = await db.user.findUnique({
				where: {
					email,
				},
			});

			if (!foundUser) {
				errors.general = 'User not found';
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

		updateUser: async (_, {
			updateUser: {
				email,
				username,
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
			const user = await checkUserAuth(context);

			if (typeof password !== "undefined") {
				password = await hashPassword(password)
			}

			if (email) {
				email = email.toUpperCase()
			}

			if (username) {
				username = username.toUpperCase()
			}

			if (firstname) {
				firstname = firstname.toUpperCase()
			}

			if (lastname) {
				lastname = lastname.toUpperCase()
			}

			try {
				if (!user) {
					errors.general = 'User not found';
					throw new UserInputError('User not found', {
						errors
					});
				}

				const newUser = await db.user.update({
					where: {
						id: user.id
					},
					data: {
						email: email,
						username: username,
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
		deleteUser: async (_, {
			userId
		}, context) => {
			const admin = await checkAdminAuth(context);




			try {

			} catch (error) {
				throw new Error(error);
			}
		}
	},
};