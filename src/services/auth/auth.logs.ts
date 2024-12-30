import Logger from "../../utils/Logger";

export type IAuthLogs =
  | "LOGIN_SUCCESS"
  | "MOBILE_LOGIN_SUCCESS"
  | "LOGIN_ERROR_GENERIC"
  | "LOGIN_ERROR_INVALID_INPUT"
  | "LOGIN_ERROR_EMAIL_NOT_FOUND"
  | "LOGIN_ERROR_INCORRECT_PASSWORD"
  | "LOGIN_ERROR_DISABLED_ACCOUNT"
  | "USER_NOT_LOGGED_IN"
  | "USER_NOT_ADMIN"
  | "USER_NOT_STANDARD_USER"
  | "ADMIN_ROLE_NOT_ASSIGNED"
  | "SESSION_CREDENTIALS_ERROR"
  | "CHECK_CREDENTIALS_ERROR"
  | "CREDENTIALS_GENERIC_ERROR"
  | "AUTH_BACK_SUCCESS"
  | "USER_NOT_FOUND"
  | "USER_NOT_FOUND_BY_TOKEN"
  | "USER_NOT_FOUND_BY_EMAIL"
  | "LOGOUT_SUCCESS"
  | "PASSWORD_RESET_SUCCESS"
  | "RESET_PASSWORD_TOKEN_INVALID"
  | "RESET_PASSWORD_EMAIL_SENT"
  | "RESET_PASSWORD_GENERIC_ERROR"
  | "REGISTRATION_SUCCESS"
  | "AUTH_GENERIC_ERROR"
  | "REGISTRATION_GENERIC_ERROR"
  | "REGISTRATION_INVALID_INPUT"
  | "REGISTRATION_EMAIL_EXISTS"
  | "REGISTRATION_PASSWORD_ERROR"
  | "USER_NOT_ENABLED"
  | "USER_NOT_VERIFIED"
  | "USER_ALREADY_VERIFIED"
  | "USER_ROLE_NOT_ASSIGNED"
  | "PROFILE_UPDATE_SUCCESS"
  | "PROFILE_UPDATE_ERROR"
  | "EMAIL_VERIFICATION_SUCCESS"
  | "EMAIL_VERIFICATION_ERROR"
  | "VERIFICATION_TOKEN_INVALID"
  | "EMAIL_VERIFICATION_SENT"
  | "ERROR_WHILE_CHECKING_CREDENTIALS"
  | "USER_ISN_T_ADMIN"
  | "USER_ISN_T_USER"
  | "USER_ISN_T_ENABLED"
  | "USER_ISN_T_LOGGED";

export const authLogs: IErrors<IAuthLogs> = {
  LOGIN_SUCCESS: {
    code: 0,
    message: 'User "{email} : {name}" has logged in successfully.',
    type: "LOGIN_SUCCESS",
  },
  MOBILE_LOGIN_SUCCESS: {
    code: 1,
    message: 'User "{email} : {name}" has logged in successfully from mobile.',
    type: "MOBILE_LOGIN_SUCCESS",
  },
  LOGIN_ERROR_GENERIC: {
    code: 2,
    message: "An error occurred while logging in user '{email}': {error}",
    type: "LOGIN_ERROR_GENERIC",
  },
  LOGIN_ERROR_INVALID_INPUT: {
    code: 3,
    message: "Invalid input provided for login: {input}",
    type: "LOGIN_ERROR_INVALID_INPUT",
  },
  LOGIN_ERROR_EMAIL_NOT_FOUND: {
    code: 4,
    message: "Failed to log in: email '{email}' does not exist.",
    type: "LOGIN_ERROR_EMAIL_NOT_FOUND",
  },
  LOGIN_ERROR_INCORRECT_PASSWORD: {
    code: 5,
    message: "Failed to log in: incorrect password for email '{email}'.",
    type: "LOGIN_ERROR_INCORRECT_PASSWORD",
  },
  LOGIN_ERROR_DISABLED_ACCOUNT: {
    code: 6,
    message: "Failed to log in: account for email '{email}' is disabled.",
    type: "LOGIN_ERROR_DISABLED_ACCOUNT",
  },
  USER_NOT_LOGGED_IN: {
    code: 7,
    message: "Action denied: the user is not logged in.",
    type: "USER_NOT_LOGGED_IN",
  },
  USER_NOT_ADMIN: {
    code: 10,
    message: "Action denied: the logged-in user is not an admin.",
    type: "USER_NOT_ADMIN",
  },
  USER_NOT_STANDARD_USER: {
    code: 20,
    message: "Action denied: the logged-in user is not a standard user.",
    type: "USER_NOT_STANDARD_USER",
  },
  ADMIN_ROLE_NOT_ASSIGNED: {
    code: 11,
    message: "The logged-in admin does not have a role assigned.",
    type: "ADMIN_ROLE_NOT_ASSIGNED",
  },
  SESSION_CREDENTIALS_ERROR: {
    code: 13,
    message: "Session error: no valid token found.",
    type: "SESSION_CREDENTIALS_ERROR",
  },
  CHECK_CREDENTIALS_ERROR: {
    code: 14,
    message: "An error occurred while verifying session credentials.",
    type: "CHECK_CREDENTIALS_ERROR",
  },
  CREDENTIALS_GENERIC_ERROR: {
    code: 15,
    message: "A generic error occurred while processing credentials.",
    type: "CREDENTIALS_GENERIC_ERROR",
  },
  AUTH_BACK_SUCCESS: {
    code: 16,
    message: 'User "{email} : {name}" has successfully reauthenticated.',
    type: "AUTH_BACK_SUCCESS",
  },
  LOGOUT_SUCCESS: {
    code: 17,
    message: 'User "{email} : {name}" has logged out successfully.',
    type: "LOGOUT_SUCCESS",
  },
  USER_NOT_FOUND: {
    code: 18,
    message: "User with ID '{userId}' not found.",
    type: "USER_NOT_FOUND",
  },
  USER_NOT_FOUND_BY_TOKEN: {
    code: 18,
    message: "User with token '{token}' not found.",
    type: "USER_NOT_FOUND_BY_TOKEN",
  },
  USER_NOT_FOUND_BY_EMAIL: {
    code: 18,
    message: "User with email '{email}' not found.",
    type: "USER_NOT_FOUND_BY_EMAIL",
  },
  PASSWORD_RESET_SUCCESS: {
    code: 22,
    message: "Password reset successfully for user '{email}'.",
    type: "PASSWORD_RESET_SUCCESS",
  },
  RESET_PASSWORD_TOKEN_INVALID: {
    code: 23,
    message: "Invalid password reset token for '{email}'.",
    type: "RESET_PASSWORD_TOKEN_INVALID",
  },
  RESET_PASSWORD_EMAIL_SENT: {
    code: 24,
    message: "Password reset email sent successfully to '{email}'.",
    type: "RESET_PASSWORD_EMAIL_SENT",
  },
  RESET_PASSWORD_GENERIC_ERROR: {
    code: 25,
    message:
      "An error occurred while sending a password reset email to '{email}': {error}",
    type: "RESET_PASSWORD_GENERIC_ERROR",
  },
  REGISTRATION_SUCCESS: {
    code: 26,
    message: 'User "{email} : {name}" has registered successfully.',
    type: "REGISTRATION_SUCCESS",
  },
  REGISTRATION_GENERIC_ERROR: {
    code: 27,
    message: "An error occurred while registering user '{email}': {error}",
    type: "REGISTRATION_GENERIC_ERROR",
  },
  REGISTRATION_INVALID_INPUT: {
    code: 28,
    message: "Invalid input provided during registration: {input}",
    type: "REGISTRATION_INVALID_INPUT",
  },
  REGISTRATION_EMAIL_EXISTS: {
    code: 29,
    message: "Failed to register: email '{email}' already exists.",
    type: "REGISTRATION_EMAIL_EXISTS",
  },
  REGISTRATION_PASSWORD_ERROR: {
    code: 31,
    message: "Failed to register: password does not meet requirements.",
    type: "REGISTRATION_PASSWORD_ERROR",
  },
  USER_NOT_ENABLED: {
    code: 32,
    message: "Action denied: the user is not enabled.",
    type: "USER_NOT_ENABLED",
  },
  USER_NOT_VERIFIED: {
    code: 33,
    message: "Action denied: the user is not verified.",
    type: "USER_NOT_VERIFIED",
  },
  USER_ALREADY_VERIFIED: {
    code: 34,
    message: "Action denied: the user is already verified.",
    type: "USER_ALREADY_VERIFIED",
  },
  USER_ROLE_NOT_ASSIGNED: {
    code: 35,
    message: "Action denied: the user does not have a role assigned.",
    type: "USER_ROLE_NOT_ASSIGNED",
  },
  PROFILE_UPDATE_SUCCESS: {
    code: 40,
    message: 'User "{email} : {name}" has updated their profile successfully.',
    type: "PROFILE_UPDATE_SUCCESS",
  },
  PROFILE_UPDATE_ERROR: {
    code: 41,
    message:
      "An error occurred while updating the profile for '{email}': {error}",
    type: "PROFILE_UPDATE_ERROR",
  },
  EMAIL_VERIFICATION_SUCCESS: {
    code: 50,
    message: 'Email verification successful for user "{email}".',
    type: "EMAIL_VERIFICATION_SUCCESS",
  },
  EMAIL_VERIFICATION_ERROR: {
    code: 51,
    message:
      "An error occurred during email verification for '{email}': {error}",
    type: "EMAIL_VERIFICATION_ERROR",
  },
  EMAIL_VERIFICATION_SENT: {
    code: 52,
    message: 'Email verification sent to user "{email}".',
    type: "EMAIL_VERIFICATION_SENT",
  },
  VERIFICATION_TOKEN_INVALID: {
    code: 53,
    message: "Invalid email verification token for '{email}'.",
    type: "VERIFICATION_TOKEN_INVALID",
  },
  AUTH_GENERIC_ERROR: {
    code: 33,
    message:
      "A generic authentication error occurred for user '{email}': {error}",
    type: "AUTH_GENERIC_ERROR",
  },
  ERROR_WHILE_CHECKING_CREDENTIALS: {
    code: 60,
    message: "An error occurred while checking user credentials",
    type: "ERROR_WHILE_CHECKING_CREDENTIALS",
  },
  USER_ISN_T_ADMIN: {
    code: 61,
    message: "User does not have administrator privileges",
    type: "USER_ISN_T_ADMIN",
  },
  USER_ISN_T_USER: {
    code: 62,
    message: "User does not have standard user privileges",
    type: "USER_ISN_T_USER",
  },
  USER_ISN_T_ENABLED: {
    code: 63,
    message: "User account is not enabled",
    type: "USER_ISN_T_ENABLED",
  },
  USER_ISN_T_LOGGED: {
    code: 64,
    message: "User is not logged in",
    type: "USER_ISN_T_LOGGED",
  },
} as const;

export default authLogs;
export const authLogger = new Logger("auth");
