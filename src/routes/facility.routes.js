import { Router } from "express";
import { registerFacility, loginFacility, logoutFacility, getCurrentFacility } from "../Controllers/facility.controller.js";
import { verifyJWT } from "../middlewares/authFacility.middleware.js";

const router = Router();
router.route("/register").post(registerFacility);
router.route("/login").post(loginFacility);

//Protected routes
router.route("/logout").post(verifyJWT, logoutFacility);
router.route("/current-facility").get(verifyJWT, getCurrentFacility);
export default router;
