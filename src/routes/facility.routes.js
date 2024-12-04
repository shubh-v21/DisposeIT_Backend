import { Router } from "express";
import {
	registerFacility,
	loginFacility,
	logoutFacility,
	getCurrentFacility,
	updateFacility,
	changeCurrentPassword,
	deleteEntry,
	getAllFacilities,
} from "../Controllers/facility.controller.js";
import { verifyJWT } from "../middlewares/authFacility.middleware.js";

const router = Router();
router.route("/register").post(registerFacility);
router.route("/login").post(loginFacility);
router.route("/get-all-facilities").get(getAllFacilities);

//Protected routes
router.route("/logout").post(verifyJWT, logoutFacility);
router.route("/delete-profile").delete(verifyJWT, deleteEntry);
router.route("/current-facility").get(verifyJWT, getCurrentFacility);
router.route("/update-account").patch(verifyJWT, updateFacility);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

export default router;
