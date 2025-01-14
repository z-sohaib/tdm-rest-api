import { UserD, UserModel } from "../../db/models/user";
import authLogs, { IAuthLogs, authLogger } from "./auth.logs";
import { formatString } from "../../utils/Strings";
import { Sign } from "../../utils/jwt";
import { HttpCodes } from "../../config/Errors";
import { ErrorResponseC, SuccessResponseC } from "./../services.response";
import { Response } from "express";
import {
  generateRandomCode,
  generateRandomToken,
  getCookiesSettings,
} from "../../utils/Function";
import { SendEmail } from "../../utils/Email";
import { oauth2Client } from "../../config/Google";
import { GOOGLE_CLIENT_ID } from "../../config/CheckableEnv";

export class AuthServices {
  /**
   * @description  Login a user
   * @param email  - String
   * @param password - String
   * @returns  ResponseT
   */
  static executeLogin = async (
    email: string,
    password: string,
    stay: boolean,
    res: Response,
  ): Promise<ResponseT> => {
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
        if (!user.isVerified) {
          const msg = formatString(authLogs.USER_NOT_VERIFIED.message, {
            email: user.email,
          });
          authLogger.error(msg);
          return new ErrorResponseC(
            authLogs.USER_NOT_VERIFIED.type,
            HttpCodes.Forbidden.code,
            msg,
          );
        }
        const isPasswordMatch = await user.comparePasswords(password);
        if (isPasswordMatch) {
          if (!user.role) {
            const msg = formatString(authLogs.USER_ROLE_NOT_ASSIGNED.message, {
              email,
            });
            authLogger.error(msg);
            return new ErrorResponseC(
              authLogs.USER_ROLE_NOT_ASSIGNED.type,
              HttpCodes.Forbidden.code,
              msg,
            );
          }
          const token = Sign({ _id: user._id.toString(), role: user.role });
          const resp: ICode<IAuthLogs> = authLogs.LOGIN_SUCCESS;
          const msg = formatString(resp.message, user.toObject());
          authLogger.info(msg, { type: resp.type });
          res.cookie("token", token, getCookiesSettings(stay));

          return new SuccessResponseC(
            resp.type,
            { ...user.Optimize(), token: token },
            msg,
            HttpCodes.Accepted.code,
          );
        }
        const msg = formatString(
          authLogs.LOGIN_ERROR_INCORRECT_PASSWORD.message,
          { email },
        );
        authLogger.error(msg);
        return new ErrorResponseC(
          authLogs.LOGIN_ERROR_INCORRECT_PASSWORD.type,
          HttpCodes.Unauthorized.code,
          msg,
        );
      }
      const msg = formatString(authLogs.LOGIN_ERROR_EMAIL_NOT_FOUND.message, {
        email,
      });
      authLogger.error(msg);
      return new ErrorResponseC(
        authLogs.LOGIN_ERROR_EMAIL_NOT_FOUND.type,
        HttpCodes.NotFound.code,
        msg,
      );
    } catch (err) {
      const msg = formatString(authLogs.LOGIN_ERROR_GENERIC.message, {
        error: (err as Error)?.message || "",
        email,
      });
      authLogger.error(msg, err as Error);
      return new ErrorResponseC(
        authLogs.LOGIN_ERROR_GENERIC.type,
        HttpCodes.InternalServerError.code,
        msg,
      );
    }
  };

  /**
   * @description Register a user
   * @param email  - String
   * @param password  - String
   * @param name  - String
   * @returns {ResponseT}
   */

  static executeRegister = async (
    email: string,
    password: string,
    name: string,
    phoneNumber: string,
    stay: boolean,
    res: Response,
    fileUrl?: string, // Add optional fileUrl parameter
  ): Promise<ResponseT> => {
    try {
      // Check if the user already exists
      const userExist = await UserModel.findOne({ email });
      if (userExist) {
        const msg = formatString(authLogs.REGISTRATION_EMAIL_EXISTS.message, {
          email,
        });
        authLogger.error(msg);
        return new ErrorResponseC(
          authLogs.REGISTRATION_EMAIL_EXISTS.type,
          HttpCodes.BadRequest.code,
          msg,
        );
      }

      // Create the new user with image if provided
      const user = new UserModel({
        email,
        password,
        name,
        phone: phoneNumber,
        image: fileUrl || null, // Add the image URL if it exists
      });

      // Generate verification token and expiry
      user.verificationToken = generateRandomToken();
      user.verificationTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      // Save the user to the database
      await user.save();

      // Send verification email
      await SendEmail({
        to: email,
        subject: "Account Verification",
        text: `Please verify your account by clicking on the link: ${process.env.HOST_URL}/api/auth/verify/${user.verificationToken}`,
      });

      // Log verification email sent
      const respOne: ICode<IAuthLogs> = authLogs.EMAIL_VERIFICATION_SENT;
      authLogger.info(formatString(respOne.message, user.toObject()), {
        type: respOne.type,
      });

      if (!user.role) {
        const msg = formatString(authLogs.USER_ROLE_NOT_ASSIGNED.message, {
          email,
        });
        authLogger.error(msg);
        return new ErrorResponseC(
          authLogs.USER_ROLE_NOT_ASSIGNED.type,
          HttpCodes.Forbidden.code,
          msg,
        );
      }

      // Generate JWT token
      const token = Sign({ _id: user._id.toString(), role: user.role });
      res.cookie("token", token, getCookiesSettings(stay));

      // Log success and return response
      const resp: ICode = authLogs.REGISTRATION_SUCCESS;
      const msg = formatString(resp.message, user.toObject());
      authLogger.info(msg, { type: resp.type });
      return new SuccessResponseC(
        resp.type,
        { ...user.Optimize(), token: token },
        msg,
        HttpCodes.Created.code,
      );
    } catch (err) {
      const msg = formatString(authLogs.REGISTRATION_GENERIC_ERROR.message, {
        error: (err as Error)?.message || "",
        email,
      });
      authLogger.error(msg, err as Error);
      return new ErrorResponseC(
        authLogs.REGISTRATION_GENERIC_ERROR.type,
        HttpCodes.InternalServerError.code,
        msg,
      );
    }
  };

  static executeAuthBack = async (
    user: UserD,
    stay: boolean,
    res: Response,
  ) => {
    try {
      const msg = formatString(authLogs.AUTH_BACK_SUCCESS.message, {
        email: user.email,
        name: user.name,
      });
      authLogger.info(msg, { type: authLogs.AUTH_BACK_SUCCESS.type });
      if (!user.role) {
        const msg = formatString(authLogs.USER_ROLE_NOT_ASSIGNED.message, {
          email: user.email,
        });
        authLogger.error(msg);
        return new ErrorResponseC(
          authLogs.USER_ROLE_NOT_ASSIGNED.type,
          HttpCodes.Forbidden.code,
          msg,
        );
      }
      const token = Sign({ _id: user.id.toString(), role: user.role });
      res.cookie("token", token, getCookiesSettings(stay));
      return new SuccessResponseC(
        authLogs.AUTH_BACK_SUCCESS.type,
        user.Optimize(),
        msg,
        HttpCodes.Accepted.code,
      );
    } catch (err) {
      const msg = formatString(authLogs.AUTH_GENERIC_ERROR.message, {
        error: (err as Error)?.message || "",
        email: user.email,
      });
      authLogger.error(msg, err as Error);
      return new ErrorResponseC(
        authLogs.AUTH_GENERIC_ERROR.type,
        HttpCodes.InternalServerError.code,
        msg,
      );
    }
  };

  /**
   * @description Verify the user account using a token
   * @param token - String
   * @returns ResponseT
   */
  static executeVerifyAccount = async (token: string): Promise<ResponseT> => {
    try {
      const user = await UserModel.findOne({
        verificationToken: token,
        verificationTokenExpiry: { $gt: new Date() },
      });

      if (!user) {
        const msg = formatString(authLogs.USER_NOT_FOUND_BY_TOKEN.message, {
          token,
        });
        authLogger.error(msg);
        return new ErrorResponseC(
          authLogs.USER_NOT_FOUND_BY_TOKEN.type,
          HttpCodes.BadRequest.code,
          msg,
        );
      }

      // verify the validity of the token

      if (user.verificationToken !== token) {
        const msg = formatString(authLogs.VERIFICATION_TOKEN_INVALID.message, {
          token,
        });
        authLogger.error(msg);
        return new ErrorResponseC(
          authLogs.VERIFICATION_TOKEN_INVALID.type,
          HttpCodes.BadRequest.code,
          msg,
        );
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiry = undefined;
      await user.save();

      const msg = formatString(authLogs.EMAIL_VERIFICATION_SUCCESS.message, {
        email: user.email,
      });
      authLogger.info(msg);
      return new SuccessResponseC(
        authLogs.EMAIL_VERIFICATION_SUCCESS.type,
        null,
        msg,
        HttpCodes.OK.code,
      );
    } catch (err) {
      const msg = formatString(authLogs.EMAIL_VERIFICATION_ERROR.message, {
        error: (err as Error)?.message || "",
      });
      authLogger.error(msg, err as Error);
      return new ErrorResponseC(
        authLogs.EMAIL_VERIFICATION_ERROR.type,
        HttpCodes.InternalServerError.code,
        msg,
      );
    }
  };

  /**
   * @description Request password reset
   * @param email - String
   * @returns ResponseT
   */
  static executeRequestPasswordReset = async (
    email: string,
  ): Promise<ResponseT> => {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        const msg = formatString(authLogs.USER_NOT_FOUND_BY_EMAIL.message, {
          email,
        });
        authLogger.error(msg);
        return new ErrorResponseC(
          authLogs.USER_NOT_FOUND_BY_EMAIL.type,
          HttpCodes.NotFound.code,
          msg,
        );
      }

      user.resetPasswordToken = generateRandomCode();
      user.resetPasswordTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
      await user.save();

      await SendEmail({
        to: email,
        subject: "Password Reset",
        text: `Use this following code to reset your password: ${user.resetPasswordToken}`,
      });

      const msg = formatString(authLogs.RESET_PASSWORD_EMAIL_SENT.message, {
        email,
      });
      authLogger.info(msg);
      return new SuccessResponseC(
        authLogs.RESET_PASSWORD_EMAIL_SENT.type,
        {
          email: user.email,
          token: user.resetPasswordToken,
          tokenExpiry: user.resetPasswordTokenExpiry,
        },
        msg,
        HttpCodes.OK.code,
      );
    } catch (err) {
      const msg = formatString(authLogs.RESET_PASSWORD_GENERIC_ERROR.message, {
        error: (err as Error)?.message || "",
        email,
      });
      authLogger.error(msg, err as Error);
      return new ErrorResponseC(
        authLogs.RESET_PASSWORD_GENERIC_ERROR.type,
        HttpCodes.InternalServerError.code,
        msg,
      );
    }
  };

  /**
   * @description Reset user password
   * @param token - String
   * @param newPassword - String
   * @returns ResponseT
   */
  static executeResetPassword = async (
    token: string,
    newPassword: string,
  ): Promise<ResponseT> => {
    try {
      const user = await UserModel.findOne({
        resetPasswordToken: token,
        resetPasswordTokenExpiry: { $gt: new Date() },
      });
      if (!user) {
        const msg = formatString(authLogs.USER_NOT_FOUND_BY_TOKEN.message, {
          token,
        });
        authLogger.error(msg);
        return new ErrorResponseC(
          authLogs.USER_NOT_FOUND_BY_TOKEN.type,
          HttpCodes.BadRequest.code,
          msg,
        );
      }

      // verify the validity of the token

      if (user.resetPasswordToken !== token) {
        const msg = formatString(
          authLogs.RESET_PASSWORD_TOKEN_INVALID.message,
          {
            token,
          },
        );
        authLogger.error(msg);
        return new ErrorResponseC(
          authLogs.RESET_PASSWORD_TOKEN_INVALID.type,
          HttpCodes.BadRequest.code,
          msg,
        );
      }

      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpiry = undefined;
      await user.save();

      const msg = formatString(authLogs.PASSWORD_RESET_SUCCESS.message, {
        email: user.email,
      });
      authLogger.info(msg);
      return new SuccessResponseC(
        authLogs.PASSWORD_RESET_SUCCESS.type,
        null,
        msg,
        HttpCodes.OK.code,
      );
    } catch (err) {
      const msg = formatString(authLogs.RESET_PASSWORD_GENERIC_ERROR.message, {
        error: (err as Error)?.message || "",
      });
      authLogger.error(msg, err as Error);
      return new ErrorResponseC(
        authLogs.RESET_PASSWORD_GENERIC_ERROR.type,
        HttpCodes.InternalServerError.code,
        msg,
      );
    }
  };

  static executeGoogleAuth = async (
    idToken: string,
    stay: boolean,
    res: Response,
  ): Promise<ResponseT> => {
    try {
      // Verify the token received from frontend
      const ticket = await oauth2Client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error("Invalid token payload");
      }

      const { email, name, picture, sub: googleId } = payload;
      let user = await UserModel.findOne({ email });

      if (!user) {
        // Create new user if doesn't exist
        user = new UserModel({
          email,
          name,
          image: picture,
          googleId,
          password: generateRandomToken(),
          isVerified: true,
          phone: "",
          role: "user",
        });
        await user.save();
      } else if (!user.googleId) {
        // Link Google account to existing user
        user.googleId = googleId;
        user.image = picture;
        await user.save();
      }

      if (!user.role) {
        const msg = formatString(authLogs.USER_ROLE_NOT_ASSIGNED.message, {
          email,
        });
        authLogger.error(msg);
        return new ErrorResponseC(
          authLogs.USER_ROLE_NOT_ASSIGNED.type,
          HttpCodes.Forbidden.code,
          msg,
        );
      }

      // Generate JWT token and set cookie
      const token = Sign({ _id: user._id.toString(), role: user.role });
      res.cookie("token", token, getCookiesSettings(stay));

      return new SuccessResponseC(
        authLogs.LOGIN_SUCCESS.type,
        { ...user.Optimize(), token },
        formatString(authLogs.LOGIN_SUCCESS.message, user.toObject()),
        HttpCodes.Accepted.code,
      );
    } catch (err) {
      const msg = formatString(authLogs.LOGIN_ERROR_GENERIC.message, {
        error: (err as Error)?.message || "",
        email: "Google Auth",
      });
      authLogger.error(msg, err as Error);
      return new ErrorResponseC(
        authLogs.LOGIN_ERROR_GENERIC.type,
        HttpCodes.InternalServerError.code,
        msg,
      );
    }
  };
}
