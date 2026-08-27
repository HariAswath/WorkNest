import { Router } from "express";
import { registerUser, login, logoutUser, verifyEMail } from "../controllers/auth.controllers.js";
import { userLoginValidator, userRegisterValidator } from "../validators/index.js";
import { validate } from "../middleware/validator.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

//unsecured routes
const router = Router();
router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, login);
router.route("/verify-email/:verificationToken").get(verifyEMail);



// Secure routes
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
