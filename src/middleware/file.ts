import { NextFunction, Request, Response } from "express";
import multer from "multer";
import fs from "fs/promises";
import cloudinary from "../config/Cloudinary";
import { ErrorResponse } from "../utils/Response";
import { HttpCodes } from "../config/Errors";
import { fileLogger, fileLogs } from "../services/files/files.logs";
import { formatString } from "../utils/Strings";

// Configure local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "tmp/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Create multer upload instance
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export const uploadToCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      fileLogger.warn(fileLogs.FILE_UPLOAD_NO_FILE.type);
      return ErrorResponse(
        res,
        HttpCodes.BadRequest.code,
        fileLogs.FILE_UPLOAD_NO_FILE.message,
      );
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    // Clean up local file after successful upload
    await fs.unlink(req.file.path);

    // Attach the file information to req.body
    req.body.fileUrl = result.secure_url;
    const msg = formatString(fileLogs.FILE_UPLOAD_SUCCESS.message, {
      filename: req.file.originalname,
    });
    fileLogger.info(msg, { type: fileLogs.FILE_UPLOAD_SUCCESS.type });
    next();
  } catch (error: any) {
    // Clean up local file on error
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    if (error.http_code === 400) {
      fileLogger.error(fileLogs.FILE_UPLOAD_INVALID_FORMAT.type, {
        filename: req?.file?.originalname,
      });
      return ErrorResponse(
        res,
        HttpCodes.BadRequest.code,
        fileLogs.FILE_UPLOAD_INVALID_FORMAT.message,
      );
    } else if (error.http_code === 401) {
      fileLogger.error(fileLogs.FILE_UPLOAD_UNAUTHORIZED.type);
      return ErrorResponse(
        res,
        HttpCodes.Unauthorized.code,
        fileLogs.FILE_UPLOAD_UNAUTHORIZED.message,
      );
    } else if (error.code === "ENOSPC") {
      fileLogger.error(fileLogs.FILE_UPLOAD_STORAGE_FULL.type);
      return ErrorResponse(
        res,
        HttpCodes.InternalServerError.code,
        fileLogs.FILE_UPLOAD_STORAGE_FULL.message,
      );
    } else if (error.code === "LIMIT_FILE_SIZE") {
      fileLogger.error(fileLogs.FILE_UPLOAD_SIZE_EXCEEDED.type, {
        filename: req?.file?.originalname,
      });
      return ErrorResponse(
        res,
        HttpCodes.BadRequest.code,
        fileLogs.FILE_UPLOAD_SIZE_EXCEEDED.message,
      );
    }

    fileLogger.error(fileLogs.FILE_UPLOAD_GENERIC_ERROR.type, {
      filename: req?.file?.originalname,
      error: error.message,
    });
    return ErrorResponse(
      res,
      HttpCodes.InternalServerError.code,
      fileLogs.FILE_UPLOAD_GENERIC_ERROR.message,
      error,
    );
  }
};

export const deleteFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      fileLogger.warn(fileLogs.FILE_DELETE_NO_ID.type);
      return ErrorResponse(
        res,
        HttpCodes.BadRequest.code,
        fileLogs.FILE_DELETE_NO_ID.message,
      );
    }

    const result = await cloudinary.uploader.destroy(public_id);
    if (result.result !== "ok") {
      fileLogger.error(fileLogs.FILE_DELETE_FAILED.type, {
        publicId: public_id,
      });
      return ErrorResponse(
        res,
        HttpCodes.BadRequest.code,
        fileLogs.FILE_DELETE_FAILED.message,
      );
    }

    const msg = formatString(fileLogs.FILE_DELETE_SUCCESS.message, {
      publicId: public_id,
    });
    fileLogger.info(msg, { type: fileLogs.FILE_DELETE_SUCCESS.type });
    next();
  } catch (error: any) {
    fileLogger.error(fileLogs.FILE_DELETE_GENERIC_ERROR.type, {
      publicId: req.body.public_id,
      error: error.message,
    });
    return ErrorResponse(
      res,
      HttpCodes.InternalServerError.code,
      fileLogs.FILE_DELETE_GENERIC_ERROR.message,
      error,
    );
  }
};

export default upload;
