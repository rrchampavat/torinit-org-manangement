import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user";
import httpStatusCode from "../utils/httpStatusCode";
import Organisation from "../models/organisation";
import logError from "../db/audit";

export const login = async (req: Request, res: Response) => {
  try {
    const { body }: { body: LoginBody } = req;

    const { email, password } = body;
    // console.log("first");
    // TODO APPLY SELECT QUERY

    const existingUser = await User.query().findOne({
      email: email
    });
    // .select(
    //   "user_id",
    //   "first_name",
    //   "last_name",
    //   "org_id"
    // );

    if (!existingUser) {
      return res.sendStatus(httpStatusCode.NO_CONTENT);
    }

    const match = await bcrypt.compare(password, existingUser?.password);

    if (!match) {
      return res
        .status(httpStatusCode.UNAUTHORIZED)
        .json({ error: "Email and password do not match" });
    }

    const accessToken = jwt.sign(
      { user_id: existingUser?.$id() },
      process.env.ACCESS_TOKEN_SECRET!
    );

    const { password: userPassword, ...userData } = existingUser;

    return res
      .status(httpStatusCode.SUCCESS)
      .json({ data: userData, accessToken: accessToken });
  } catch (error: any) {
    await logError({
      message: error.message,
      module: "login",
      req_url: req.originalUrl,
      req_method: req.method,
      req_host: req.headers["host"]
    });
    return res
      .status(error.code || httpStatusCode.SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { body }: { body: RegisterBody } = req;

    const { email, firstName, lastName, orgID, password } = body;

    const existingUser = await User.query().findOne({
      email: email
    });

    if (existingUser) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: "Email is already in use!" });
    }

    // TODO: PROVIDE SECRET SALT FROM .env
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.query().insert({
      email: email,
      first_name: firstName,
      last_name: lastName,
      org_id: orgID!,
      password: hashedPassword
    });

    const { password: tempPassword, ...data } = newUser;

    const accessToken = jwt.sign(
      {
        user_id: newUser?.$id()
      },
      process.env.ACCESS_TOKEN_SECRET!,
      {}
    );

    return res.status(httpStatusCode.CREATED).json({
      data: data,
      accessToken: accessToken
    });
  } catch (error: any) {
    await logError({
      message: error.message,
      module: "register",
      req_url: req.originalUrl,
      req_method: req.method,
      req_host: req.headers["host"]
    });

    return res
      .status(error.code || httpStatusCode.SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const registerWithOrg = async (req: Request, res: Response) => {
  try {
    const { body }: { body: RegisterWithOrg } = req;

    const { user, organisation } = body;

    const { name, address, city, state, country } = organisation;
    const { firstName, lastName, email, password } = user;

    const existingOrganisation = await Organisation.query().findOne({
      name: name
    });

    if (existingOrganisation) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: "Organisation name is already taken!" });
    }

    // * START TRASACTION
    const trx = await Organisation.startTransaction();

    try {
      const newOrganisation = await Organisation.query(trx).insert({
        name: name,
        address: address,
        city: city,
        state: state,
        country: country
      });

      const existingUser = await User.query(trx).findOne({
        email: email
      });

      if (existingUser) {
        return res
          .status(httpStatusCode.BAD_REQUEST)
          .json({ error: "Email is already in use!" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.query(trx).insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        org_id: newOrganisation?.$id(),
        password: hashedPassword
      });

      const { password: tempPassword, ...userData } = newUser;

      // * COMPLETES TRANSATION IF NO ERROR
      await trx.commit();

      return res.status(httpStatusCode.CREATED).json({
        data: {
          organisation: organisation,
          user: userData
        }
      });
    } catch (error: any) {
      // * ROLLBACKS TRANSATION IF ANY ERROR
      await trx.rollback();

      await logError({
        message: error.message,
        module: "registerWithOrg",
        req_url: req.originalUrl,
        req_method: req.method,
        req_host: req.headers["host"]
      });

      return res
        .status(error.code || httpStatusCode.SERVER_ERROR)
        .json({ error: error.message });
    }
  } catch (error: any) {
    await logError({
      message: error.message,
      module: "registerWithOrg",
      req_url: req.originalUrl,
      req_method: req.method,
      req_host: req.headers["host"]
    });
    return res
      .status(error.code || httpStatusCode.SERVER_ERROR)
      .json({ error: error.message });
  }
};
