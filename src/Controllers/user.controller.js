import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { verifyJWT } from "../middlewares/authUser.middleware.js";
//access token aur refresh token generate karne ke liye function
const generateAccessAndRefreshToken = async (userId) => {
	try {
		const user = await User.findById(userId);
		// console.log(user);
		const accessToken = await user.generateAccessToken();
		const refreshToken = await user.generateRefreshToken();
		// console.log(accessToken, refreshToken);
		user.refreshToken = refreshToken;
		await user.save({ validateBeforeSave: false });
		return { accessToken, refreshToken };
	} catch (error) {
		throw new ApiError(500, "Something went wrong while generating tokens");
	}
};

//Registration of user logic
const registerUser = asyncHandler(async (req, res) => {
	//get userDetails from frontend
	//validation - not empty
	//check if user already exists via username , email
	//check for images , check for avatar
	//upload them to cloudinary
	//create user object - create entry in db
	//remove password and refresh token field from response
	//check for user creation
	//return response

	const { fullName, email, username, password } = req.body;
	// console.log("email: ", email);

	if ([fullName, email, password, username].some((field) => field?.trim() === "")) {
		throw new ApiError(400, "All fields are required");
	}

	const existedUser = await User.findOne({
		$or: [{ username }, { email }],
	});

	if (existedUser) {
		throw new ApiError(409, "User with email or username already exists");
	}

	const user = await User.create({
		fullName,

		email,
		password,
		username: username.toLowerCase(),
	});

	const createdUser = await User.findById(user._id).select("-password -refreshToken");

	if (!createdUser) {
		throw new ApiError(500, "Something went wrong while registering user");
	}
	// console.log("res: ", res);
	return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});

//Login of user logic

const loginUser = asyncHandler(async (req, res) => {
	//req body se data lena hai
	//user details enter karvani hai jaise username ya email
	//check karna hai ki user exist karta hai ya nhi
	//agar nhi exist karta toh error throw karna hai
	//exist karta hai toh password check karna hai
	//password correct na ho toh error dena hai
	//password correct hone pe access token aur refresh token generate karna hai
	//send cookie
	const { email, username, password } = req.body;
	//agar username aur email dono hi enter nhi karte toh ek error throw karenge ki kuch to do
	if (!username && !email) {
		throw new ApiError(401, "Either username or email is required");
	}

	const user = await User.findOne({
		$or: [{ username }, { email }],
	});

	if (!user) {
		throw new ApiError(404, "User does not exist");
	}
	const isPasswordValid = user.isPasswordCorrect(password);

	if (!isPasswordValid) {
		throw new ApiError(401, "User credentials are invalid");
	}

	const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

	const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
	const options = {
		httpOnly: true,
		secure: true,
	};

	return res
		.status(200)
		.cookie("AccessToken", accessToken, options)
		.cookie("RefreshToken", refreshToken, options)
		.json(
			new ApiResponse(
				200,
				{
					user: loggedInUser,
					accessToken,
					refreshToken,
				},
				"User logged in successfully"
			)
		);
});

//logout of user logic

const logoutUser = asyncHandler(async (req, res) => {
	//logged in user db mein locate kiya through id
	//uske refresh token ko delete kiya taki voh aage se login na kar pae
	//cookies clear kiye
	await User.findByIdAndUpdate(
		req.user?._id,
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
		secure: true,
	};

	return res
		.status(200)
		.clearCookie("AccessToken", options)
		.clearCookie("RefreshToken", options)
		.json(new ApiResponse(200, {}, "User logged out"));
});

// const refreshAccesToken = asyncHandler(async (req, res) => {
// 	try {
// 		const incomingRefreshToken = req.cookies["RefreshToken"] || req.body["RefreshToken"];

// 		if (!incomingRefreshToken) {
// 			throw new ApiError(401, "Unauthorized request");
// 		}
// 		const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
// 		console.log(decodedToken);
// 		const user = await User.findById(decodedToken?._id);
// 		if (!user) {
// 			throw new ApiError(401, "Invalid Refresh Token");
// 		}
// 		if (user?.refreshToken !== incomingRefreshToken) {
// 			throw new ApiError(401, "Refresh Token is either expired or used");
// 		}
// 		const options = {
// 			httpOnly: true,
// 			secure: true,
// 		};
// 		const { newAccessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);
// 		return res
// 			.status(200)
// 			.cookie("AccessToken", newAccessToken, options)
// 			.cookie("RefreshToken", newRefreshToken, options)
// 			.json(new ApiResponse(200, { newAccessToken, refreshToken: newRefreshToken }, "Access Token refreshed successfully"));
// 	} catch (error) {
// 		throw new ApiError(500, error?.message || "Invalid refresh token");
// 	}
// });

// const changeCurrentPassword = asyncHandler(async (req, res) => {
// 	const { oldPassword, newPassword } = req.body;

// 	const user = await User.findById(req.user?._id);
// 	const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
// 	if (!isPasswordCorrect) {
// 		throw new ApiError(400, "Invalid Old Password");
// 	}
// 	user.password = newPassword;
// 	await user.save({ validateBeforeSave: false });

// 	return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
// });

const getCurrentUser = asyncHandler(async (req, res) => {
	return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
});

// const updateAccountDetails = asyncHandler(async (req, res) => {
// 	const { fullName, email } = req.body;

// 	if (!fullName && !email) {
// 		throw new ApiError(400, "Either field is required");
// 	}

// 	const user = await User.findByIdAndUpdate(
// 		req.user?._id,
// 		{
// 			$set: { fullName, email },
// 		},
// 		{ new: true, select: "-password" } // Select only required fields
// 	);

// 	// Prepare a sanitized response

// 	return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
// });

export { registerUser, loginUser, getCurrentUser, logoutUser };