import { Router } from "express";
import {
  createOrgWithEmployee,
  createOrganisation,
  deleteOrganisation,
  getOrgWithEmployee,
  getOrganisation,
  getOrganisations,
  getOrgsWitheEmployee,
  updateOrganisation
} from "../controllers/organisationController";
import {
  createOrgBodyValidator,
  registerWithOrgBodyValidator,
  updateOrgBodyValidator
} from "../validators/bodyValidator";
import { isAdmin, isOrgAdmin, isOrgUser } from "../middlewares/verifyRole";

const router = Router();

router.get("/employee", isOrgUser || isAdmin, getOrgsWitheEmployee);
router.post(
  "/employee",
  isAdmin,
  registerWithOrgBodyValidator,
  createOrgWithEmployee
);
router.get("/employee/:id", isOrgUser || isAdmin, getOrgWithEmployee);

router.post("/", isAdmin, createOrgBodyValidator, createOrganisation);
router.get("/", isAdmin, getOrganisations);
router.get("/:id", isAdmin, getOrganisation);
router.delete("/:id", isAdmin, deleteOrganisation);
router.patch(
  "/:id",
  isAdmin || isOrgAdmin,
  updateOrgBodyValidator,
  updateOrganisation
);

export default router;
