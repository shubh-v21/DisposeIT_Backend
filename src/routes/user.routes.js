import { Router } from "express";
import {
	registerUser,
	loginUser,
	logoutUser,
	// refreshAccessToken,
	changeCurrentPassword,
	getCurrentUser,
	updateAccountDetails,
	deleteEntry,
} from "../Controllers/user.controller.js";
import { verifyJWT } from "../middlewares/authUser.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
// router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/delete-profile").delete(verifyJWT, deleteEntry);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

export default router;
