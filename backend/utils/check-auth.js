import { AuthenticationError } from 'apollo-server';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const checkAuth = (context) => {
	if (context.req.headers.admin) {
		console.log('admin hit')
		const authHeader = context.req.headers.admin

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
	}

	if (context.req.headers.authorization) {
		console.log('authorization hit')
		const authHeader = context.req.headers.authorization
		
		if (authHeader) {
			const token = authHeader;

			if (token) {
				try {
					const user = jwt.verify(token, process.env.JWT_USER_SECRET);
					return user;
				} catch (err) {
					throw new AuthenticationError('Invalid token');
				}
			}
			throw new Error('Invalid Header, check header contents');
		}
	}

	throw new Error('No Auth header found');
};

export default checkAuth;