import Joi from "joi";

// Joi validation schema for facility
const facilityValidationSchema = Joi.object({
	email: Joi.string().email().required().messages({
		"string.email": "Invalid email format",
		"any.required": "Email is required",
	}),
	facilityName: Joi.string().required().min(3).messages({
		"string.min": "Facility Name must be of atleast three characters",
		"any.required": "Facility Name is required",
	}),
	state: Joi.string().required().messages({
		"any.required": "State is required",
	}),
	city: Joi.string().required().messages({
		"any.required": "City is required",
	}),
	pincode: Joi.string().required().messages({
		"any.required": "Pincode is required",
	}),
	addressLine1: Joi.string().required().messages({
		"any.required": "Address Line 1 is required",
	}),
	addressLine2: Joi.string().optional().allow(""),
	contactNo: Joi.number().required().messages({
		"any.required": "Contact Number is required",
	}),
	pickupAvailability: Joi.boolean().optional(),
	wasteTypes: Joi.array().items(Joi.string()).required().messages({
		"array.required": "Waste Types is required",
	}),
	openingHours: Joi.string().required().messages({
		"any.required": "Opening Hours is required",
	}),
	closingHours: Joi.string().required().messages({
		"any.required": "Closing Hours is required",
	}),
	workingDays: Joi.array()
		.items(Joi.string().valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"))
		.required()
		.messages({
			"array.required": "Working Days is required",
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

export default facilityValidationSchema;
