/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/user";
import Organisation from "../models/organisation";
import httpStatusCode from "../utils/httpStatusCode";
import { CustomRequest, ReqQuery, RequestParams } from "../types/extendedTypes";
import logError from "../db/audit";
import createQuery from "../helper/queryBuilder";

export const createOrganisation = async (req: CustomRequest, res: Response) => {
  try {
    const { body }: { body: CreateOrgBody } = req;

    const { name, address, city, state, country } = body;

    const existingOrganisation = await Organisation.query().findOne({
      name: name
    });

    if (existingOrganisation) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: "Organisation name is already in use!" });
    }

    await Organisation.query().insert({
      name: name,
      address: address,
      city: city,
      state: state,
      country: country
    });

    return res.sendStatus(httpStatusCode.CREATED);
  } catch (error: any) {
    await logError({
      message: error.message,
      module: "createOrganisation",
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

export const getOrganisations = async (req: CustomRequest, res: Response) => {
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

    const getAllOrgsQuery = Organisation.query().where({ is_active: true });

    const newQuery = createQuery({
      query: getAllOrgsQuery,
      page: Number(page),
      per_page: Number(per_page),
      search: search!,
      search_field: search_field!,
      sort_by: sort_by!,
      sort_order: sort_order!
    });

    // Organisation[] | Page<Organisation | User> | User[]

    const organisations: any = await newQuery.select(
      "org_id",
      "name",
      "address",
      "city",
      "state",
      "country",
      "created_at"
    );

    if (page) {
      const { results, total } = organisations;

      return res.status(httpStatusCode.SUCCESS).json({
        data: results,
        total: total
      });
    }

    return res.status(httpStatusCode.SUCCESS).json({
      data: organisations,
      total: organisations.length
    });
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

export const getOrganisation = async (req: CustomRequest, res: Response) => {
  try {
    const { params }: { params: RequestParams } = req;

    const organisation = await Organisation.query()
      .findById(params?.id!)
      .where({
        is_active: true
      });

    if (!organisation) {
      return res.sendStatus(httpStatusCode.NO_CONTENT);
    }

    return res.status(httpStatusCode.SUCCESS).json({ data: organisation });
  } catch (error: any) {
    await logError({
      message: error.message,
      module: "getOrganisation",
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

export const deleteOrganisation = async (req: CustomRequest, res: Response) => {
  try {
    const { params }: { params: RequestParams } = req;

    const organisation = await Organisation.query()
      .findById(params?.id!)
      .where({
        is_active: true
      });

    if (!organisation) {
      return res.sendStatus(httpStatusCode.NO_CONTENT);
    }

    await Organisation.query().findById(params?.id!).patch({
      is_active: false
    });

    return res.sendStatus(httpStatusCode.ACCEPTED);
  } catch (error: any) {
    await logError({
      message: error.message,
      module: "deleteOrganisation",
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

export const updateOrganisation = async (req: CustomRequest, res: Response) => {
  try {
    const { body, params }: { body: CreateOrgBody; params: RequestParams } =
      req;

    if (body?.name) {
      const otherOrg = await Organisation.query().findOne({
        name: body.name
      });

      if (otherOrg) {
        return res
          .status(httpStatusCode.BAD_REQUEST)
          .json({ error: "Organisation name is already in use!" });
      }
    }

    const organisation = await Organisation.query()
      .findById(params?.id!)
      .where({
        is_active: true
      });

    if (!organisation) {
      return res.sendStatus(httpStatusCode.NO_CONTENT);
    }

    await Organisation.query().findById(params?.id!).patch(body);

    return res.sendStatus(httpStatusCode.CREATED);
  } catch (error: any) {
    await logError({
      message: error.message,
      module: "updateOrganisation",
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

export const createOrgWithEmployee = async (
  req: CustomRequest,
  res: Response
) => {
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
        .json({ error: "Organisation name is already in use!" });
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
          organisation: newOrganisation,
          user: userData
        }
      });
    } catch (error: any) {
      // * ROLLBACKS TRANSATION IF ANY ERROR
      await trx.rollback();

      await logError({
        message: error.message,
        module: "createOrgWithEmployee",
        req_url: req.originalUrl,
        req_method: req.method,
        req_host: req.headers["host"],
        user_id: req.user?.user_id
      });

      return res
        .status(error.code || httpStatusCode.SERVER_ERROR)
        .json({ error: error.message });
    }
  } catch (error: any) {
    await logError({
      message: error.message,
      module: "createOrgWithEmployee",
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

export const getOrgsWitheEmployee = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const organisations = await Organisation.query()
      .where({ is_active: true })
      .withGraphFetched("user as employees")
      .modifyGraph("employees", (builder) => {
        builder.select("first_name", "last_name", "email");
      })
      .orderBy("org_id");

    return res.status(httpStatusCode.SUCCESS).json({ data: organisations });
  } catch (error: any) {
    await logError({
      message: error.message,
      module: "getOrgsWitheEmployee",
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

export const getOrgWithEmployee = async (req: CustomRequest, res: Response) => {
  try {
    const { params }: { params: RequestParams } = req;

    const organisation = await Organisation.query()
      .findById(params?.id!)
      .where({
        is_active: true
      })
      .withGraphFetched("user as employees")
      .modifyGraph("employees", (builder) => {
        builder.select("first_name", "last_name", "email");
      });

    if (!organisation) {
      return res.sendStatus(httpStatusCode.NO_CONTENT);
    }

    return res.status(httpStatusCode.SUCCESS).json({
      data: {
        organisation
      }
    });
  } catch (error: any) {
    await logError({
      message: error.message,
      module: "getOrgWithEmployee",
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
