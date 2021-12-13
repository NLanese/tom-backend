import { AuthenticationError } from 'apollo-server';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const checkAdminAuth = (context) => {
	const authHeader = context.req.headers.authorization

	if (authHeader) {
		const token = authHeader;

		if (token) {
			try {
				const admin = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
				return admin
			} catch (err) {
				throw new AuthenticationError('Invalid token')
			}
		}
		throw new Error('Invalid Header, check header contents')
	}

	throw new Error('No Auth header found');
};

export default checkAdminAuth;