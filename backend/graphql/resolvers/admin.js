import bcrypt from 'bcryptjs';
import hashPassword from '../../utils/passwordHashing.js';
import generateAdminToken from '../../utils/generateToken/generateAdminToken.js';
import checkUserAuth from '../../utils/checkAuthorization/check-user-auth.js';
import { UserInputError } from 'apollo-server-errors';
import {
	validateRegisterInput,
	validateLoginInput,
} from '../../utils/validators.js';
import db from '../../utils/generatePrisma.js';

export default {
    Mutation: {
        signupAdmin: async (_, { email, password, username, firstname, lastname }, context) => {
            try {
                const { valid, errors } = validateRegisterInput(
                    username,
                    email,
                    password
                );

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

            const foundUser = await db.admin.findUnique({
                where: {
                    email,
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
        }
    }
}