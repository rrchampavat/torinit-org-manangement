/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Response } from "express";
import User from "../models/user";
import httpStatusCode from "../utils/httpStatusCode";
import { CustomRequest, ReqQuery, RequestParams } from "../types/extendedTypes";
import Organisation from "../models/organisation";
import logError from "../db/audit";
import createQuery from "../helper/queryBuilder";

export const getUsers = async (req: CustomRequest, res: Response) => {
  try {
    const { query }: { query: ReqQuery } = req;
    const {
      page,
      per_page,
      sort_by = "created_at",
      sort_order = "asc",
      search,
      search_field
    } = query;

    const getAllUsersQuery = User.query()
      .joinRelated("organisation")
      .where("users.is_active", true);

    const newQuery = createQuery({
      query: getAllUsersQuery,
      page: Number(page),
      per_page: Number(per_page),
      search: search!,
      search_field: search_field!,
      sort_by: sort_by,
      sort_order: sort_order
    });

    const users: any = await newQuery.select(
      "users.user_id",
      "users.first_name",
      "users.last_name",
      "users.email",
      "organisation.name as organisation",
      "users.created_at",
      "users.updated_at"
    );

    if (page) {
      const { results, total } = users;

      return res.status(httpStatusCode.SUCCESS).json({
        data: results,
        total: total
      });
    }

    return res
      .status(httpStatusCode.SUCCESS)
      .json({ data: users, total: users.length });
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

export const getUser = async (req: CustomRequest, res: Response) => {
  try {
    const { params, user }: { params: RequestParams; user?: any } = req;

    const userID = Number(params.id) || user?.user_id;

    const existingUser = await User.query()
      .findById(userID)
      .leftJoinRelated("organisation")
      .leftJoinRelated("role")
      .leftJoinRelated("department")
      .select(
        "users.*",
        "organisation.name as organisation",
        "role.name as role",
        "department.name as department"
      )
      .where("users.is_active", true);

    if (!existingUser) {
      return res.sendStatus(httpStatusCode.NO_CONTENT);
    }

    const { password, ...userData } = existingUser;

    return res.status(httpStatusCode.SUCCESS).json({ data: userData });
  } catch (error: any) {
    await logError({
      message: error.message,
      module: "getUser",
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

export const updateUser = async (req: CustomRequest, res: Response) => {
  try {
    const {
      params,
      body
    }: {
      params: RequestParams;
      body: UserUpdateBody;
    } = req;

    const { firstName, lastName, email, orgID } = body;

    const otherUser = await User.query().findOne({
      email: email
    });

    if (otherUser) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: "Email is already in use!" });
    }

    const existingUser = await User.query()
      .findById(params.id!)
      .where({ is_active: true });

    if (!existingUser) {
      return res.sendStatus(httpStatusCode.NO_CONTENT);
    }

    if (body?.orgID) {
      const existingOrganisation = await Organisation.query().findById(
        body?.orgID
      );

      if (!existingOrganisation) {
        return res
          .status(httpStatusCode.NO_CONTENT)
          .json({ error: "Organisation not found!" });
      }
    }

    await User.query()
      .patch({
        first_name: firstName,
        last_name: lastName,
        email: email,
        org_id: orgID
      })
      .findById(params?.id!);

    return res.sendStatus(httpStatusCode.CREATED);
  } catch (error: any) {
    await logError({
      message: error.message,
      module: "updateUser",
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

export const deleteUser = async (req: CustomRequest, res: Response) => {
  try {
    const { params }: { params: RequestParams } = req;

    const existingUser = await User.query().findById(params.id!).where({
      is_active: true
    });

    if (!existingUser?.org_id) {
      return res.sendStatus(httpStatusCode.FORBIDDEN);
    }

    if (!existingUser) {
      return res.sendStatus(httpStatusCode.NO_CONTENT);
    }

    await User.query().findById(params?.id!).patch({
      is_active: false
    });

    return res.sendStatus(httpStatusCode.NO_CONTENT);
  } catch (error: any) {
    await logError({
      message: error.message,
      module: "deleteUser",
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

export const getOrgUsers = async (req: CustomRequest, res: Response) => {
  try {
    const { query, user }: { query: ReqQuery; user?: any } = req;
    const {
      page,
      per_page,
      sort_by = "created_at",
      sort_order = "asc",
      search,
      search_field
    } = query;

    const getAllUsersQuery = User.query()
      .joinRelated("organisation")
      .where({ "users.is_active": true, "users.org_id": user?.org_id })
      .leftJoinRelated("role")
      .leftJoinRelated("department")
      .leftJoinRelated("project");

    const newQuery = createQuery({
      query: getAllUsersQuery,
      page: Number(page),
      per_page: Number(per_page),
      search: search!,
      search_field: search_field!,
      sort_by: sort_by,
      sort_order: sort_order
    });

    const users: any = await newQuery.select(
      "users.user_id",
      "users.first_name",
      "users.last_name",
      "users.email",
      "role.name as role",
      "department.name as department",
      "project.name as project",
      "organisation.name as organisation",
      "users.created_at",
      "users.updated_at"
    );

    if (page) {
      const { results, total } = users;

      return res.status(httpStatusCode.SUCCESS).json({
        data: results,
        total: total
      });
    }

    return res
      .status(httpStatusCode.SUCCESS)
      .json({ data: users, total: users.length });
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
