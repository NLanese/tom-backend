const validateRegisterInput = (email, password, username) => {
	const errors = {};

	if (username.trim() === '') {
		errors.username = 'Name must not be empty';
	}
	if (email.trim() === '') {
		errors.email = 'Email must not be empty';
	}
	if (password.trim() === '') {
		errors.password = 'Password must not be empty';
	}

	return {
		errors,
		valid: Object.keys(errors).length < 1,
	};
};

const validateLoginInput = (email, password) => {
	const errors = {};

	if (email.trim() === '') {
		errors.email = 'Email must not be empty';
	}
	if (password.trim() === '') {
		errors.password = 'Password must not be empty';
	}
	
	return {
		errors,
		valid: Object.keys(errors).length < 1,
	};
};

export { validateLoginInput, validateRegisterInput };