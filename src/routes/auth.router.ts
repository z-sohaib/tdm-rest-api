import {
  loginValidators,
  registerValidators,
  passwordResetRequestValidators,
  passwordResetValidators,
} from "../services/auth/auth.validator";
import {
  SignIn,
  SignUp,
  AuthBack,
  VerifyAccount,
  RequestPasswordReset,
  ResetPassword,
} from "../controller/auth.controller";
import { Router } from "express";
import { validator } from "../middleware/validator";
import { checkLogs, isLoggedIn } from "../middleware/auth";

const authRouter = Router();

authRouter.route("/login").post(loginValidators, validator, SignIn);
authRouter.route("/register").post(registerValidators, validator, SignUp);
authRouter.route("/").get(checkLogs, isLoggedIn, AuthBack);
authRouter.route("/verify/:token").get(VerifyAccount);
authRouter
  .route("/password/reset")
  .post(passwordResetRequestValidators, validator, RequestPasswordReset);
authRouter
  .route("/password/reset/:token")
  .post(passwordResetValidators, validator, ResetPassword);

export default authRouter;
