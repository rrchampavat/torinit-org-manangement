import { NextFunction, Request, Response } from "express";
import httpStatusCode from "../utils/httpStatusCode";

import { emailRegEx, passwordRegex } from "../utils/regEx";

export const loginBodyValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body }: { body: LoginBody } = req;
    const { email, password } = body;

    if (!email || !password) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: "Please provide all the requried fields!" });
    }

    next();

    return;
  } catch (error: any) {
    return res
      .status(error.code || httpStatusCode.SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const registerBodyValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body }: { body: RegisterBody } = req;

    const { firstName, lastName, email, orgID, password } = body;

    if (!firstName || !lastName || !email || !orgID || !password) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: "Please provide all required fields!" });
    }

    if (!emailRegEx.test(email)) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: "Please provide valid email address!" });
    }

    if (!passwordRegex.test(password)) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        error:
          "Password must be at-least 8 characters long and must contain 1 capital letter, 1 small letter, 1 number and 1 special character!"
      });
    }

    next();

    return;
  } catch (error: any) {
    return res
      .status(error.code || httpStatusCode.SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const updateUserBodyValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body }: { body: UserUpdateBody } = req;

    const { firstName, lastName, email, orgID } = body;

    if (!firstName && !lastName && !email && !orgID) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: "Please provide a value to update!" });
    }

    if (!emailRegEx.test(email)) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: "Please provide valid email address!" });
    }

    next();

    return;
  } catch (error: any) {
    return res
      .status(error.code || httpStatusCode.SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const createOrgBodyValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body }: { body: CreateOrgBody } = req;

    const { name, address, city, state, country } = body;

    if (!name || !address || !city || !state || !country) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: "Provide all the requried fields!" });
    }

    next();

    return;
  } catch (error: any) {
    return res
      .status(error.code || httpStatusCode.SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const registerWithOrgBodyValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body }: { body: RegisterWithOrg } = req;

    const { user, organisation } = body;

    const { firstName, lastName, email, password } = user;

    const { name, address, city, state, country } = organisation;

    if (!name || !address || !city || !state || !country) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: "Provide all the requried fields!" });
    }

    if (!firstName || !lastName || !email || !password) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: "Please provide all required fields!" });
    }

    if (!emailRegEx.test(email)) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: "Please provide valid email address!" });
    }

    if (!passwordRegex.test(password)) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        error:
          "Password must be at-least 8 characters long and must contain 1 capital letter, 1 small letter, 1 number and 1 special character!"
      });
    }

    next();

    return;
  } catch (error: any) {
    return res
      .status(error.code || httpStatusCode.SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const updateOrgBodyValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body }: { body: CreateOrgBody } = req;

    const { name, address, city, state, country } = body;

    if (!name && !address && !city && !state && !country) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: "Provide a field to update!" });
    }

    next();

    return;
  } catch (error: any) {
    return res
      .status(error.code || httpStatusCode.SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const createTicketBodyValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body }: { body: CreateTicketBody } = req;

    const { title, description } = body;

    if (!title || !description) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: "Provide all the required fields!" });
    }

    next();

    return;
  } catch (error: any) {
    return res
      .status(error.code || httpStatusCode.SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const changeTicketStatusBodyValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body }: { body: ChangeTicketStatusBody } = req;

    const { status } = body;

    if (!status) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: "Provide all the required fields!" });
    }

    if (isNaN(status)) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: "Status must be number!" });
    }

    if (![1, 2, 3, 4].includes(status)) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: "Please provide valid status!" });
    }

    next();

    return;
  } catch (error: any) {
    return res
      .status(error.code || httpStatusCode.SERVER_ERROR)
      .json({ error: error.message });
  }
};
