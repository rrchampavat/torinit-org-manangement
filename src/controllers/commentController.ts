import { Response } from "express";
import {
  CustomRequest,
  RequestParams,
  RequestUser
} from "../types/extendedTypes";
import logError from "../db/audit";
import httpStatusCode from "../utils/httpStatusCode";
import Comment from "../models/comment";
import { fn, ref } from "objection";
import Ticket from "../models/ticket";

export const createComment = async (req: CustomRequest, res: Response) => {
  try {
    const {
      body,
      user
    }: { body: { message: string; ticketID: number }; user?: RequestUser } =
      req;

    const { message, ticketID } = body;

    const existingTicket = await Ticket.query().findById(body.ticketID);

    if (!existingTicket) {
      return res.sendStatus(httpStatusCode.NO_CONTENT);
    }

    await Comment.query().insert({
      user_id: user?.user_id,
      message: message,
      ticket_id: ticketID
    });

    return res.sendStatus(httpStatusCode.CREATED);
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

export const getTicketComments = async (req: CustomRequest, res: Response) => {
  try {
    const { params }: { params: RequestParams } = req;

    const existingTicket = await Ticket.query().findById(params.id!);

    if (!existingTicket) {
      return res.sendStatus(httpStatusCode.NO_CONTENT);
    }

    const ticketComments = await Comment.query()
      .where({
        ticket_id: params.id
      })
      .leftJoinRelated("user")
      .select(
        "comments.*",
        fn.concat(ref("user.first_name"), " ", ref("user.last_name")).as("user")
      );

    return res.status(httpStatusCode.SUCCESS).json({ data: ticketComments });
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
