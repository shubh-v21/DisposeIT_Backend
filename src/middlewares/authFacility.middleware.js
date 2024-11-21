import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Facility } from "../models/facility.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
	try {
		const token = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ", "");

		// console.log(token);
		if (!token) {
			throw new ApiError(401, "Unauthorized request");
		}

		const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

		const facility = await Facility.findById(decodedToken?._id).select("-password -refreshToken");

		if (!facility) {
			throw new ApiError(401, "Invalid Access Token");
		}

		req.facility = facility;
		next();
	} catch (error) {
		throw new ApiError(401, error?.message || "Invalid access token");
	}
});
