import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import httpStatusCode from "../utils/httpStatusCode";
import User from "../models/user";
import { CustomRequest } from "../types/extendedTypes";
import logError from "../db/audit";

const validateToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.sendStatus(httpStatusCode.UNAUTHORIZED);
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtPayload;

    const existingUser = await User.query()
      .findById(decodedToken?.user_id)
      .select(
        "user_id",
        "first_name",
        "last_name",
        "email",
        "org_id",
        "proj_id",
        "dept_id",
        "role_id",
        "created_at",
        "updated_at"
      );

    if (!existingUser) {
      return res.sendStatus(httpStatusCode.NO_CONTENT);
    }

    req.user = existingUser;

    next();

    return;
  } catch (error: any) {
    await logError({
      message: error.message,
      module: "getUsers",
      req_url: req.originalUrl,
      req_method: req.method,
      req_host: req.headers["host"],
      user_id: req.user?.user_id
    });

    return res
      .status(error.code || httpStatusCode.SERVER_ERROR)
      .json({ error: error.message });
  }
};

export default validateToken;
