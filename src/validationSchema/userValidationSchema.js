// validationSchemas.js
import Joi from "joi";

const userValidationSchema = Joi.object({
	username: Joi.string().min(3).max(30).required().messages({
		"string.min": "Username must be at least 3 characters long",
		"any.required": "Username is required",
	}),
	email: Joi.string().email().required().messages({
		"string.email": "Invalid email format",
		"any.required": "Email is required",
	}),
	fullName: Joi.string().min(3).required().messages({
		"string.min": "Full name must be at least 3 characters long",
		"any.required": "Full name is required",
	}),
	password: Joi.string()
		.min(6)
		.regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/)
		.required()
		.messages({
			"string.min": "Password must be at least 6 characters long",
			"any.required": "Password is required",
			"string.pattern.base":
				"Password must contain at least one special character, one uppercase letter, one lowercase letter, and a number",
		}),
});

export default userValidationSchema;
