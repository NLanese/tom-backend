import { AuthenticationError } from 'apollo-server';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const checkSuperAuth = (context) => {
	const authHeader = context.req.headers.authorization

	if (authHeader) {
		const token = authHeader;

		if (token) {
			try {
				const superUser = jwt.verify(token, process.env.JWT_SUPER_SECRET);
				return superUser
			} catch (err) {
				throw new AuthenticationError('Error: Invalid token')
			}
		}
		throw new Error('Error: Invalid Header, check header contents')
	}

	throw new Error('Error: No Auth header found');
};

export default checkSuperAuth;