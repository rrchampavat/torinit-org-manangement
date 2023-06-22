import { Router } from "express";
import {
  createComment,
  getTicketComments
} from "../controllers/commentController";

const router = Router();

router.post("/", createComment);
router.get("/ticket/:id", getTicketComments);

export default router;
