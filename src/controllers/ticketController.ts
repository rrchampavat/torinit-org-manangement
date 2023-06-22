/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Response } from "express";
import {
  CustomRequest,
  ReqQuery,
  RequestParams,
  RequestUser
} from "../types/extendedTypes";
import logError from "../db/audit";
import httpStatusCode from "../utils/httpStatusCode";
import Ticket from "../models/ticket";
import { fn, ref } from "objection";
import createQuery from "../helper/queryBuilder";
import User from "../models/user";
import Department from "../models/department";

export const createTicket = async (req: CustomRequest, res: Response) => {
  try {
    const { body, user }: { body: CreateTicketBody; user?: RequestUser } = req;

    const { title, description, dept_id } = body;

    const existingUser = await User.query().findById(user?.user_id!);

    if (!existingUser) {
      return res.sendStatus(httpStatusCode.NO_CONTENT);
    }

    const ticket = await Ticket.query().insert({
      title: title,
      description: description,
      user_id: user?.user_id!,
      org_id: user?.org_id!,
      dept_id: dept_id
    });

    return res.status(httpStatusCode.CREATED).json({ data: ticket });
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

export const getAllTickets = async (req: CustomRequest, res: Response) => {
  try {
    const { query, user }: { query: ReqQuery; user?: RequestUser } = req;

    const {
      page,
      per_page,
      sort_by = "created_at",
      sort_order = "asc",
      search,
      search_field
    } = query;

    const existingDept = await Department.query().findById(user?.dept_id!);
    const existingUser = await User.query().findById(user?.dept_id!);

    if (!existingDept || !existingUser) {
      return res.sendStatus(httpStatusCode.NO_CONTENT);
    }

    const getAllTicketsQuery = Ticket.query()
      .where({
        "tickets.dept_id": user?.dept_id
      })
      .whereIn("status", [1, 3, 4])
      .join("ticket_statuses", "tickets.status", "ticket_statuses.status_id")
      .leftJoinRelated("department as departments")
      .withGraphFetched("user as raised_by")
      .modifyGraph("raised_by", (builder) => {
        builder
          .leftJoin("roles", "users.role_id", "roles.role_id")
          .leftJoin("departments", "users.dept_id", "departments.dept_id")
          .leftJoin("projects", "users.proj_id", "projects.proj_id")
          .select(
            "users.user_id",
            fn
              .concat(ref("users.first_name"), " ", ref("users.last_name"))
              .as("name"),
            "roles.name as role",
            "departments.name as department",
            "projects.name as project"
          );
      })
      .withGraphFetched("comment as comments")
      .modifyGraph("comments", (builder) => {
        builder
          .join("users", "comments.user_id", "users.user_id")
          .select(
            "comments.cmt_id",
            "comments.message",
            fn
              .concat(ref("users.first_name"), " ", ref("users.last_name"))
              .as("user"),
            "comments.created_at"
          );
      });

    const newQuery = createQuery({
      query: getAllTicketsQuery,
      page: Number(page),
      per_page: Number(per_page),
      search: search!,
      search_field: search_field!,
      sort_by: sort_by!,
      sort_order: sort_order!
    });

    const tickets = await newQuery.select(
      "ticket_id",
      "title",
      "description",
      "tickets.status as status_id",
      "tickets.org_id",
      "ticket_statuses.status_name as status",
      "tickets.created_at",
      "departments.dept_id as dept_id",
      "departments.name as department"
    );

    return res.status(httpStatusCode.SUCCESS).json({ data: tickets });
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

export const getUserTickets = async (req: CustomRequest, res: Response) => {
  try {
    const { user, query }: { user?: RequestUser; query: ReqQuery } = req;

    const {
      page,
      per_page,
      sort_by = "created_at",
      sort_order = "asc",
      search,
      search_field
    } = query;

    const getUserTicketsQuery = Ticket.query()
      .where({
        "users.user_id": user?.user_id,
        "users.is_active": true
      })
      .leftJoin(
        "ticket_statuses",
        "tickets.status",
        "ticket_statuses.status_id"
      )
      .leftJoin("users", "tickets.user_id", "users.user_id")
      .leftJoinRelated("department as departments")
      .leftJoin("projects", "users.proj_id", "projects.proj_id")
      .withGraphFetched("comment as comments")
      .modifyGraph("comments", (builder) => {
        builder
          .join("users", "comments.user_id", "users.user_id")
          .select(
            "comments.cmt_id",
            "comments.message",
            fn
              .concat(ref("users.first_name"), " ", ref("users.last_name"))
              .as("user"),
            "comments.created_at"
          );
      });

    const newQuery = createQuery({
      query: getUserTicketsQuery,
      page: Number(page),
      per_page: Number(per_page),
      search: search!,
      search_field: search_field!,
      sort_by: sort_by!,
      sort_order: sort_order!
    });

    const tickets = await newQuery.select(
      "ticket_id",
      "title",
      "description",
      "status as status_id",
      "users.user_id",
      "tickets.org_id",
      "ticket_statuses.status_name as status",
      fn
        .concat(ref("users.first_name"), " ", ref("users.last_name"))
        .as("employee"),
      "tickets.created_at",
      "projects.name as project",
      "departments.dept_id as dept_id",
      "departments.name as department"
    );

    return res.status(httpStatusCode.SUCCESS).json({ data: tickets });
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

export const changeTicketStatus = async (req: CustomRequest, res: Response) => {
  try {
    const {
      body,
      params
    }: { body: ChangeTicketStatusBody; params: RequestParams } = req;

    const existingTicket = await Ticket.query()
      .findById(params?.id!)
      .whereIn("status", [1, 3]);

    if (!existingTicket) {
      return res.sendStatus(httpStatusCode.NO_CONTENT);
    }

    await Ticket.query().findById(params?.id!).patch({ status: body.status });

    return res.sendStatus(httpStatusCode.SUCCESS);
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

export const changeTicketDepartment = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const {
      body,
      params
    }: { body: { dept_id: number }; params: RequestParams } = req;

    await Ticket.query().findById(params.id!).patch({
      dept_id: body.dept_id
    });

    return res.sendStatus(httpStatusCode.CREATED);
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
