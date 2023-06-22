import { NextFunction, Request, Response } from "express";
import httpStatusCode from "../../utils/httpStatusCode";

export const createBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body }: { body: { name: string } } = req;

    const { name } = body;

    if (!name) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: "Please provide all the required fields!" });
    }

    if (typeof name !== "string") {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: "Name must be string!" });
    }

    next();

    return;
  } catch (error: any) {
    return res
      .status(error.code || httpStatusCode.SERVER_ERROR)
      .json({ error: error.message });
  }
};
