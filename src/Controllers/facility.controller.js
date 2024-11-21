import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Facility } from "../models/facility.model.js";
import facilityValidationSchema from "../validationSchema/facilityValidationSchema.js";
import { User } from "../models/user.model.js";
const generateAccessAndRefreshToken = async (facilityId) => {
	try {
		const facility = await Facility.findById(facilityId);

		const accessToken = await facility.generateAccessToken();
		const refreshToken = await facility.generateRefreshToken();
		facility.refreshToken = refreshToken;
		await facility.save({ validationBeforeSave: false });
		return { accessToken, refreshToken };
	} catch (error) {
		throw new ApiError(500, "Somethig went wrong while generating tokens");
	}
};

//Registration of the center

const registerFacility = asyncHandler(async (req, res) => {
	const { error } = facilityValidationSchema.validate(req.body);
	if (error) {
		console.log(error);
		throw new ApiError(400, error.details[0].message);
	}
	const {
		email,
		facilityName,
		state,
		city,
		pincode,
		addressLine1,
		addressLine2,
		contactNo,
		pickupAvailability,
		wasteTypes,
		openingHours,
		closingHours,
		workingDays,
		password,
	} = req.body;
	if (
		[email, facilityName, state, city, pincode, addressLine1, contactNo, openingHours, closingHours, password].some((field) => {
			if (typeof field === "number") {
				field = field.toString(); // Convert number to string
			}
			return typeof field !== "string" || field.trim() === "";
		})
	) {
		throw new ApiError(400, "Please fill all the fields");
	}
	if (!Array.isArray(wasteTypes) || wasteTypes.length === 0) {
		throw new ApiError(400, "Waste types must be a non-empty array");
	}

	if (!Array.isArray(workingDays) || workingDays.length === 0) {
		throw new ApiError(400, "Working days must be a non-empty array");
	}
	const existingFacility = await Facility.findOne({
		$or: [{ email }, { contactNo }],
	});
	if (existingFacility) {
		throw new ApiError(400, "Center with this email or contact no. already exists");
	}
	const facility = await Facility.create({
		email: email.toLowerCase(),
		facilityName,
		state,
		city,
		pincode,
		addressLine1,
		addressLine2,
		contactNo,
		pickupAvailability,
		wasteTypes,
		openingHours,
		closingHours,
		workingDays,
		password,
	});
	console.log(facility._id);
	const createdFacility = await Facility.findById(facility._id).select("-password -refreshToken");

	if (!createdFacility) {
		throw new ApiError(500, "Something went wrong while registering user");
	}

	return res.status(201).json(new ApiResponse(201, createdFacility, "Facility created successfully"));
});

const loginFacility = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email && !password) {
		throw new ApiError(400, "Please fill all the fields");
	}

	const facility = await Facility.findOne({ email });
	if (!facility) {
		throw new ApiError(404, "Facility with this email not found");
	}
	const isPasswordValid = await facility.isPasswordCorrect(password);
	if (!isPasswordValid) {
		throw new ApiError(401, "User Credentials are invalid");
	}
	const { accessToken, refreshToken } = await generateAccessAndRefreshToken(facility._id);
	const loggedInFacility = await Facility.findById(facility._id).select("-password -refreshToken");
	const options = {
		httpOnly: true,
		secure: true,
		sameSite: true,
	};
	return res
		.status(200)
		.cookie("AccessToken", accessToken, options)
		.cookie("RefreshToken", refreshToken, options)
		.json(
			new ApiResponse(
				200,
				{
					facility: loggedInFacility,
					accessToken,
					refreshToken,
				},
				"User logged in successfully"
			)
		);
});

const logoutFacility = asyncHandler(async (req, res) => {
	await Facility.findByIdAndUpdate(
		req.facility?._id,
		{
			$unset: {
				refreshToken: 1,
			},
		},
		{
			new: true,
		}
	);
	const options = {
		httpOnly: true,
		Secure: true,
	};

	return res
		.status(200)
		.clearCookie("AccessToken", options)
		.clearCookie("RefreshToken", options)
		.json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getCurrentFacility = asyncHandler(async (req, res) => {
	return res.status(200).json(new ApiResponse(200, req.facility, "Facility fetched successfully"));
});
export { registerFacility, loginFacility, logoutFacility, getCurrentFacility };
