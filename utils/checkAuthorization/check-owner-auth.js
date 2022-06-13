import { AuthenticationError } from 'apollo-server';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const checkOwnerAuth = (context) => {
	// const authHeader = context.req.headers.authorization
	const token = context
	// if (authHeader) {
	// 	const token = authHeader;

	console.log(token)

		if (token) {
			try {
				const owner = jwt.verify(token, process.env.JWT_OWNER_SECRET);
				return owner
			} catch (err) {
				throw new AuthenticationError('Error: Invalid token')
			}
		}
		throw new Error('Error: Invalid Header, check header contents')
	// }

	// throw new Error('Error: No Auth header found');
};

export default checkOwnerAuth;