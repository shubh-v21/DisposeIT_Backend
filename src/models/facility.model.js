import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const facilitySchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		facilityName: {
			type: String,
			required: true,
			trim: true,
		},

		// location: {
		//     type: String,
		//     required: true
		// },

		state: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		pincode: {
			type: String,
			required: true,
		},
		addressLine1: {
			type: String,
			required: true,
		},
		addressLine2: {
			type: String,
		},
		contactNo: {
			type: Number,
			required: true,
		},
		pickupAvailability: {
			type: Boolean,
			default: true,
		},
		wasteTypes: {
			type: [String],
			required: true,
		},
		openingHours: {
			type: String,
			required: true,
		},
		closingHours: {
			type: String,
			required: true,
		},
		workingDays: {
			type: [String],
			required: true,
		},

		refreshToken: {
			type: String,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

facilitySchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	this.password = await bcrypt.hash(this.password, 10);
	next();
});

facilitySchema.methods.isPasswordCorrect = async function (password) {
	return await bcrypt.compare(password, this.password);
};

facilitySchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
			facilityName: this.facilityName,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
		}
	);
};
facilitySchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
		}
	);
};

export const Facility = mongoose.model("Facility", facilitySchema);
