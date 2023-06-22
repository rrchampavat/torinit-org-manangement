import { Router } from "express";
import {
  login,
  register,
  registerWithOrg
} from "../controllers/authController";
import {
  loginBodyValidator,
  registerBodyValidator,
  registerWithOrgBodyValidator
} from "../validators/bodyValidator";

const router = Router();

router.post("/login", loginBodyValidator, login);
router.post("/register", registerBodyValidator, register);
router.post(
  "/register-with-org",
  registerWithOrgBodyValidator,
  registerWithOrg
);

export default router;
