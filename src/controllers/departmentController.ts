import { Response } from "express";
import {
  CustomRequest,
  RequestParams,
  RequestUser
} from "../types/extendedTypes";
import logError from "../db/audit";
import httpStatusCode from "../utils/httpStatusCode";
import Department from "../models/department";
import Organisation from "../models/organisation";
import { fn, ref } from "objection";

export const createDepartment = async (req: CustomRequest, res: Response) => {
  try {
    const {
      body,
      user
    }: { body: { org_id: number; name: string }; user?: RequestUser } = req;
    const { name, org_id } = body;

    const orgID = org_id || user?.dept_id;

    const existingOrg = Organisation.query().findById(orgID!).where({
      is_active: true
    });

    if (!existingOrg) {
      return res.sendStatus(httpStatusCode.NO_CONTENT);
    }

    await Department.query().insert({
      name: name,
      org_id: orgID
    });

    return res.sendStatus(httpStatusCode.CREATED);
  } catch (error: any) {
    await logError({
      message: error.message,
      module: "getOrganisations",
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

export const getOrgDepartments = async (req: CustomRequest, res: Response) => {
  try {
    const { user, params }: { user?: RequestUser; params: RequestParams } = req;

    const orgDepartments = await Department.query()
      .where({
        org_id: Number(params.id) || user?.org_id
      })
      .withGraphFetched("user as employess")
      .modifyGraph("employees", (builder) => {
        builder
          .leftJoinRelated("role")
          .leftJoinRelated("project")
          .select(
            "users.user_id",
            fn
              .concat(ref("users.first_name"), " ", ref("users.last_name"))
              .as("name"),
            "users.email",
            "role.name as role",
            "project.name as project"
          );
      });

    return res.status(httpStatusCode.SUCCESS).json({ data: orgDepartments });
  } catch (error: any) {
    await logError({
      message: error.message,
      module: "getOrganisations",
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

export const getDepartmentByID = async (req: CustomRequest, res: Response) => {
  try {
    const { user, params }: { user?: RequestUser; params: RequestParams } = req;

    const existingDept = await Department.query()
      .findById(params.id!)
      .where({
        "departments.org_id": user?.org_id,
        "departments.is_active": true
      })
      .withGraphFetched("user as employees")
      .modifyGraph("employees", (builder) => {
        builder
          .leftJoinRelated("role")
          .leftJoinRelated("project")
          .select(
            "users.user_id",
            fn
              .concat(ref("users.first_name"), " ", ref("users.last_name"))
              .as("name"),
            "users.email",
            "role.name as role",
            "project.name as project"
          );
      });

    if (!existingDept) {
      return res.sendStatus(httpStatusCode.NO_CONTENT);
    }

    return res.status(httpStatusCode.SUCCESS).json({ data: existingDept });
  } catch (error: any) {
    await logError({
      message: error.message,
      module: "getOrganisations",
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

export const updateDepartment = async (req: CustomRequest, res: Response) => {
  try {
    const {
      body,
      params,
      user
    }: {
      body: { name: string; org_id: number };
      params: RequestParams;
      user?: RequestUser;
    } = req;

    const { name, org_id } = body;

    const orgID = org_id || user?.org_id;

    const existingDept = await Department.query()
      .findById(params.id!)
      .leftJoinRelated("organisation")
      .where({
        "organisation.is_active": true,
        "departments.is_active": true
      });

    if (!existingDept) {
      return res.sendStatus(httpStatusCode.NO_CONTENT);
    }

    await Department.query()
      .findById(params.id!)
      .where({
        org_id: orgID
      })
      .patch({
        name: name
      });

    return res.sendStatus(httpStatusCode.CREATED);
  } catch (error: any) {
    await logError({
      message: error.message,
      module: "getOrganisations",
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

export const deleteDepartment = async (req: CustomRequest, res: Response) => {
  try {
    const { params, user }: { params: RequestParams; user?: RequestUser } = req;

    const existingDept = await Department.query()
      .findById(params.id!)
      .leftJoinRelated("organisation")
      .where({
        "departments.is_active": true,
        "organisation.is_active": true
      });

    if (!existingDept) {
      return res.sendStatus(httpStatusCode.NO_CONTENT);
    }

    await Department.query()
      .findById(params.id!)
      .where({
        org_id: user?.org_id
      })
      .patch({
        is_active: false
      });

    return res.sendStatus(httpStatusCode.ACCEPTED);
  } catch (error: any) {
    await logError({
      message: error.message,
      module: "getOrganisations",
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
