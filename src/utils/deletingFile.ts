import fs from "fs/promises";
export const DeleteFile = (path: string) => {
  fs.unlink(path).catch(() => {
    throw new Error(`Could not delete file ${path}`);
  });
};
