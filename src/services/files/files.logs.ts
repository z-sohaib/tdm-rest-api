import Logger from "../../utils/Logger";

export type IFileLogs =
  | "FILE_UPLOAD_SUCCESS"
  | "FILE_UPLOAD_NO_FILE"
  | "FILE_UPLOAD_INVALID_FORMAT"
  | "FILE_UPLOAD_UNAUTHORIZED"
  | "FILE_UPLOAD_STORAGE_FULL"
  | "FILE_UPLOAD_SIZE_EXCEEDED"
  | "FILE_UPLOAD_GENERIC_ERROR"
  | "FILE_DELETE_SUCCESS"
  | "FILE_DELETE_NO_ID"
  | "FILE_DELETE_FAILED"
  | "FILE_DELETE_GENERIC_ERROR";

export const fileLogs: IErrors<IFileLogs> = {
  FILE_UPLOAD_SUCCESS: {
    code: 100,
    message: "File successfully uploaded: {filename}",
    type: "FILE_UPLOAD_SUCCESS",
  },
  FILE_UPLOAD_NO_FILE: {
    code: 101,
    message: "No file provided for upload",
    type: "FILE_UPLOAD_NO_FILE",
  },
  FILE_UPLOAD_INVALID_FORMAT: {
    code: 102,
    message: "Invalid file format or corrupt file: {filename}",
    type: "FILE_UPLOAD_INVALID_FORMAT",
  },
  FILE_UPLOAD_UNAUTHORIZED: {
    code: 103,
    message: "Unauthorized file upload attempt",
    type: "FILE_UPLOAD_UNAUTHORIZED",
  },
  FILE_UPLOAD_STORAGE_FULL: {
    code: 104,
    message: "Storage space insufficient for file upload",
    type: "FILE_UPLOAD_STORAGE_FULL",
  },
  FILE_UPLOAD_SIZE_EXCEEDED: {
    code: 105,
    message: "File size exceeds the 5MB limit: {filename}",
    type: "FILE_UPLOAD_SIZE_EXCEEDED",
  },
  FILE_UPLOAD_GENERIC_ERROR: {
    code: 106,
    message: "Error uploading file {filename}: {error}",
    type: "FILE_UPLOAD_GENERIC_ERROR",
  },
  FILE_DELETE_SUCCESS: {
    code: 107,
    message: "File successfully deleted: {publicId}",
    type: "FILE_DELETE_SUCCESS",
  },
  FILE_DELETE_NO_ID: {
    code: 108,
    message: "No public ID provided for file deletion",
    type: "FILE_DELETE_NO_ID",
  },
  FILE_DELETE_FAILED: {
    code: 109,
    message: "Failed to delete file: {publicId}",
    type: "FILE_DELETE_FAILED",
  },
  FILE_DELETE_GENERIC_ERROR: {
    code: 110,
    message: "Error deleting file {publicId}: {error}",
    type: "FILE_DELETE_GENERIC_ERROR",
  },
} as const;

export default fileLogs;
export const fileLogger = new Logger("files");
