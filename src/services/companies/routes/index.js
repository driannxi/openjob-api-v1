import { Router } from "express";
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompanyById,
  deleteCompany,
} from "../controller/companies-controller.js";
import authenticateToken from "../../../middlewares/auth.js";
import validate from "../../../middlewares/validate.js";
import { companyPayloadSchema } from "../validator/schema.js";
import { checkCompanyExists } from "../../../middlewares/companyError.js";

const router = Router();

router.post(
  "/companies",
  authenticateToken,
  validate(companyPayloadSchema),
  createCompany,
);
router.get("/companies", getAllCompanies);
router.get("/companies/:id", getCompanyById);

router.put(
  "/companies/:id",
  authenticateToken,
  checkCompanyExists,
  validate(companyPayloadSchema),
  updateCompanyById,
);
router.delete("/companies/:id", authenticateToken, deleteCompany);

export default router;
