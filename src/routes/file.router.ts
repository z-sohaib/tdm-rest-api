import { Router, Request, Response } from "express";
import { upload, uploadToCloudinary, deleteFile } from "../middleware/file";
import { checkLogs } from "../middleware/auth";
import { SuccessResponse } from "../utils/Response";

const router = Router();

/* router.all("*", checkLogs, loggedIn /* ,hasRole(["S", "A"]) * /); */

router
  .route("/")
  .all(checkLogs)
  .post(
    upload.single("file"),
    uploadToCloudinary,
    (req: Request, res: Response) => {
      return SuccessResponse(res, 200, {
        message: "File uploaded successfully",
        url: req.body.fileUrl,
        public_id: req.body.publicId,
      });
    },
  )
  .delete(deleteFile, (req: Request, res: Response) => {
    return SuccessResponse(res, 200, {
      message: "File deleted successfully",
    });
  });

console.log("🗃️ Files upload is on");
export default router;
