import { Router } from "express";
import {
  deleteUser,
  getOrgUsers,
  getUser,
  getUsers,
  updateUser
} from "../controllers/usersController";
import { updateUserBodyValidator } from "../validators/bodyValidator";

const router = Router();

router.get("/", getUsers);
router.get("/organisation", getOrgUsers);
router.get("/:id", getUser);
router.patch("/:id", updateUserBodyValidator, updateUser);
router.delete("/:id", deleteUser);

export default router;
