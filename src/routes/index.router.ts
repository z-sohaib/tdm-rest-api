import { Router, Request, Response } from "express";

const indexRouter = Router();

indexRouter.get("/", async (_req: Request, res: Response) => {
  res.send("Hello World");
});

export default indexRouter;
