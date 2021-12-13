import bcrypt from 'bcryptjs';
import hashPassword from '../../utils/passwordHashing.js';
import generateUserToken from '../../utils/generateToken/generateUserToken.js';
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
    }
}