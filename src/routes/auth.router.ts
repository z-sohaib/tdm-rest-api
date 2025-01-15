import {
  loginValidators,
  registerValidators,
  passwordResetRequestValidators,
  passwordResetValidators,
  googleAuthValidators,
} from "../services/auth/auth.validator";
import {
  SignIn,
  SignUp,
  AuthBack,
  VerifyAccount,
  RequestPasswordReset,
  ResetPassword,
  GoogleAuth,
} from "../controller/auth.controller";
import { Router } from "express";
import { validator } from "../middleware/validator";
import { checkLogs, isLoggedIn } from "../middleware/auth";
// import { upload, uploadToCloudinary } from "../middleware/file";

const authRouter = Router();

authRouter.route("/login").post(loginValidators, validator, SignIn);
authRouter.route("/register").post(
  // upload.single("image"), // Add file upload middleware
  // uploadToCloudinary, // Add cloudinary upload middleware
  registerValidators,
  validator,
  SignUp,
);
authRouter.route("/").get(checkLogs, isLoggedIn, AuthBack);
authRouter.route("/verify/:token").get(VerifyAccount);
authRouter
  .route("/password/reset")
  .post(passwordResetRequestValidators, validator, RequestPasswordReset);
authRouter
  .route("/password/reset/:token")
  .post(passwordResetValidators, validator, ResetPassword);
authRouter.route("/google").post(googleAuthValidators, validator, GoogleAuth);

export default authRouter;
