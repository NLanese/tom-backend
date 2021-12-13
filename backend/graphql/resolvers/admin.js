import bcrypt from 'bcryptjs';
import hashPassword from '../../utils/passwordHashing.js';
import generateAdminToken from '../../utils/generateToken/generateAdminToken.js';
import checkAdminAuth from '../../utils/checkAuthorization/check-admin-auth.js';
import { UserInputError } from 'apollo-server-errors';
import {
	validateRegisterInput,
	validateLoginInput,
} from '../../utils/validators.js';
import db from '../../utils/generatePrisma.js';

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
                        users: true
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        },
    },

    Mutation: {
        signupAdmin: async (_, { email, password, username, firstname, lastname }, context) => {
            try {
                const { valid, errors } = validateRegisterInput(
                    username,
                    email,
                    password
                );

                email = await email.toUpperCase()
                username = await username.toUpperCase()
                firstname = await firstname.toUpperCase()
                lastname = await lastname.toUpperCase()

                if (!valid) {
                    throw new userInputError('Errors', { errors })
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

                const checkUsername = await db.admin.findUnique({
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

                return await db.admin.create({
                    data: {
                        email: email,
                        username: username,
                        password: password,
                        firstname: firstname,
                        lastname: lastname
                    },  
                });
            } catch (error) {
                throw new Error(error)
            }
        },

        signinAdmin: async (_, { email, password }, { req }) => {
            const { errors, valid } = validateLoginInput(email, password);

            if (!valid) {
                throw new userInputError('Errors', { errors })
            }

            email = await email.toUpperCase()

            const foundUser = await db.admin.findUnique({
                where: {
                    email
                }
            })

            if (!foundUser) {
				errors.general = 'User not found';
				throw new UserInputError('Incorrect Email', { errors });
			}

            const isValid = await bcrypt.compare(password, foundUser.password)

            if (!isValid) {
                errors.general = 'Incorrect Password'
                throw new UserInputError('Incorrect Password', { errors })
            }

            const token = await generateAdminToken(foundUser.id)

            req.session = { token: `Bearer ${token}`}

            return { ...foundUser, token: token }
        },

        updateAdmin: async (_, { email, username, firstname, lastname, password }, context) => {
            const admin = await checkAdminAuth(context)

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
                if (!admin) {
					errors.general = 'User not found';
					throw new UserInputError('User not found', { errors });
				}

                return await db.admin.update({
                    where: {
                        id: admin.id
                    },
                    data: {
                        email: email,
						username: username,
						firstname: firstname,
						lastname: lastname,
						password: password 
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}