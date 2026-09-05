import { Router } from "express";
import { registerUser, login, logoutUser, verifyEMail, forgotPasswordRequest, resetForgotPassword, refreshAccessToken, changeCurrentPassword, getCurrentUser, resendEmailVerification } from "../controllers/auth.controllers.js";
import { userForgotPasswordValidator, userLoginValidator, userRegisterValidator, userResetForgotPasswordValidator, userChangeCurrentPasswordValidator} from "../validators/index.js";
import { validate } from "../middleware/validator.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

//unsecured routes
const router = Router();
router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, login);
router.route("/verify-email/:verificationToken").get(verifyEMail);
router.route("/forgot-password").post(userForgotPasswordValidator(), validate, forgotPasswordRequest);
router
  .route("/reset-password/:resetToken")
  .post(userResetForgotPasswordValidator(), validate, resetForgotPassword);
router.route("/refresh-token").post(refreshAccessToken);



// Secure routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router
  .route("/change-password")
  .post(
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    changeCurrentPassword,
  );
router
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerification);


export default router;
