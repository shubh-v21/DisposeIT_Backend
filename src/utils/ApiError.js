class ApiError extends Error {
	constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
		super(message);
		this.statusCode = statusCode;
		this.message = message;
		this.success = false;
		this.errors = errors;
		this.data = null;

		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}

	// Add a toJSON method to format the error as JSON
	toJSON() {
		return {
			success: this.success,
			statusCode: this.statusCode,
			message: this.message,
			errors: this.errors,
			data: this.data,
		};
	}
}

export { ApiError };
