import { AuthenticationError } from 'apollo-server';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const checkAuth = (context) => {
	const authHeader = context.req.headers.authorization
	
	if (authHeader) {
		const token = authHeader;
		if (token) {
			try {
				const user = jwt.verify(token, process.env.JWT_SECRET);
				return user;
			} catch (err) {
				throw new AuthenticationError('Invalid token');
			}
		}
		throw new Error('Invalid Header, check header contents');
	}
	throw new Error('No Auth header found');
};

export default checkAuth;