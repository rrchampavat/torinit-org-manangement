/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { NextFunction, Response } from "express";
import {
  CustomRequest,
  RequestParams,
  RequestUser
} from "../types/extendedTypes";
import httpStatusCode from "../utils/httpStatusCode";
import logError from "../db/audit";
import User from "../models/user";

export const isAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;

    if (user?.org_id) {
      return res.sendStatus(httpStatusCode.FORBIDDEN);
    }

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

export const isOrgAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;

    const existingUser = await User.query()
      .findById(user?.user_id!)
      .where({
        "users.is_active": true
      })
      .joinRelated("role")
      .select("role.name as role_name");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (existingUser?.role_name !== "Admin") {
      return res.sendStatus(httpStatusCode.UNAUTHORIZED);
    }

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

export const isOrgUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body,
      user,
      params
    }: { body: { org_id: number }; user?: RequestUser; params: RequestParams } =
      req;

    if ((body.org_id || Number(params?.id)) !== user?.org_id) {
      return res.sendStatus(httpStatusCode.FORBIDDEN);
    }

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
