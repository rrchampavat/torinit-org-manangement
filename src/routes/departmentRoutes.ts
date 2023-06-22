import { Router } from "express";
import {
  createDepartment,
  deleteDepartment,
  getDepartmentByID,
  getOrgDepartments,
  updateDepartment
} from "../controllers/departmentController";
import { isAdmin, isOrgAdmin, isOrgUser } from "../middlewares/verifyRole";

const router = Router();

router.post("/", isOrgAdmin || isAdmin, createDepartment);
router.get("/organisation/:id", isOrgUser, getOrgDepartments);
router.get("/:id", isOrgUser, getDepartmentByID);
router.patch("/:id", isOrgAdmin || isAdmin, updateDepartment);
router.delete("/:id", isOrgAdmin || isAdmin, deleteDepartment);

export default router;
