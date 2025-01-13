import { Response } from "express";
import { UserD } from "../db/models/user";
import { MyRequest } from "../types/Express";
import { ErrorResponse, SuccessResponse } from "../utils/Response";
import { AuthServices } from "../services/auth/auth.service";
import {
  ErrorResponseC,
  SuccessResponseC,
} from "../services/services.response";

// Sign In Endpoint
export const SignIn = async (req: MyRequest<UserD>, res: Response) => {
  const { email, password, stay = false } = req.body;
  const result = await AuthServices.executeLogin(email, password, stay, res);
  if (result instanceof SuccessResponseC)
    return SuccessResponse(
      res,
      result.code,
      result.data,
      result.message,
      result.status,
    );
  if (result instanceof ErrorResponseC)
    return ErrorResponse(res, result.code, result.message, result.error);
};

// Sign Up Endpoint
export const SignUp = async (req: MyRequest<UserD>, res: Response) => {
  const {
    email,
    password,
    name,
    phoneNumber,
    stay = false,
    fileUrl,
  } = req.body;
  const result = await AuthServices.executeRegister(
    email,
    password,
    name,
    phoneNumber,
    stay,
    res,
    fileUrl, // Pass the fileUrl from uploadToCloudinary middleware
  );
  if (result instanceof SuccessResponseC)
    return SuccessResponse(
      res,
      result.code,
      result.data,
      result.message,
      result.status,
    );
  if (result instanceof ErrorResponseC)
    return ErrorResponse(res, result.code, result.message, result.error);
};

// Auth Back Endpoint
export const AuthBack = async (req: MyRequest<UserD>, res: Response) => {
  const { stay = false } = req.body;
  const result = await AuthServices.executeAuthBack(req.user!, stay, res);
  if (result instanceof SuccessResponseC)
    return SuccessResponse(
      res,
      result.code,
      result.data,
      result.message,
      result.status,
    );
  if (result instanceof ErrorResponseC)
    return ErrorResponse(res, result.code, result.message, result.error);
};

// Verify Account Endpoint
export const VerifyAccount = async (req: MyRequest<UserD>, res: Response) => {
  const { token } = req.params;
  const result = await AuthServices.executeVerifyAccount(token);
  if (result instanceof SuccessResponseC)
    return SuccessResponse(
      res,
      result.code,
      result.data,
      result.message,
      result.status,
    );
  if (result instanceof ErrorResponseC)
    return ErrorResponse(res, result.code, result.message, result.error);
};

// Request Password Reset Endpoint
export const RequestPasswordReset = async (
  req: MyRequest<UserD>,
  res: Response,
) => {
  const { email } = req.body;
  const result = await AuthServices.executeRequestPasswordReset(email);
  if (result instanceof SuccessResponseC)
    return SuccessResponse(
      res,
      result.code,
      result.data,
      result.message,
      result.status,
    );
  if (result instanceof ErrorResponseC)
    return ErrorResponse(res, result.code, result.message, result.error);
};

// Reset Password Endpoint
export const ResetPassword = async (req: MyRequest<UserD>, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  const result = await AuthServices.executeResetPassword(token, newPassword);
  if (result instanceof SuccessResponseC)
    return SuccessResponse(
      res,
      result.code,
      result.data,
      result.message,
      result.status,
    );
  if (result instanceof ErrorResponseC)
    return ErrorResponse(res, result.code, result.message, result.error);
};
