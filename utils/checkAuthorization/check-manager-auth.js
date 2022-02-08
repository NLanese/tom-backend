import { AuthenticationError } from 'apollo-server';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const checkManagerAuth = (context) => {
	const authHeader = context.req.headers.authorization

	if (authHeader) {
		const token = authHeader;

		if (token) {
			try {
				const manager = jwt.verify(token, process.env.JWT_MANAGER_SECRET);
				return manager
			} catch (err) {
				throw new AuthenticationError('Error: Invalid token')
			}
		}
		throw new Error('Error: Invalid Header, check header contents')
	}

	throw new Error('Error: No Auth header found');
};

export default checkManagerAuth;