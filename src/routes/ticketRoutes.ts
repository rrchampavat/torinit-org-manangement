import { Router } from "express";
import {
  changeTicketDepartment,
  changeTicketStatus,
  createTicket,
  getAllTickets,
  getUserTickets
} from "../controllers/ticketController";
import { isOrgAdmin } from "../middlewares/verifyRole";
import {
  changeTicketStatusBodyValidator,
  createTicketBodyValidator
} from "../validators/bodyValidator";

const router = Router();

router.post("/", createTicketBodyValidator, createTicket);
router.get("/", isOrgAdmin, getAllTickets);
router.get("/user", getUserTickets);
router.patch(
  "/status/:id",
  isOrgAdmin,
  changeTicketStatusBodyValidator,
  changeTicketStatus
);
router.patch("/department/:id", isOrgAdmin, changeTicketDepartment);

export default router;
