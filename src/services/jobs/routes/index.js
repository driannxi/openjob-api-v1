import { Router } from "express";
import {
  createJob,
  getJobById,
  getJobsByCompanyId,
  getJobsByCategoryId,
  updateJobById,
  deleteJobById,
  getAllJobs,
} from "../controller/jobs-controller.js";
import authenticateToken from "../../../middlewares/auth.js";
import validate from "../../../middlewares/validate.js";
import {
  jobPayloadSchema,
  updateJobPayloadSchema,
} from "../validator/schema.js";

const router = Router();

router.post("/jobs", authenticateToken, validate(jobPayloadSchema), createJob);
router.get("/jobs", getAllJobs);
router.get("/jobs/company/:companyId", getJobsByCompanyId);
router.get("/jobs/category/:categoryId", getJobsByCategoryId);
router.get("/jobs/:id", getJobById);
router.put(
  "/jobs/:id",
  authenticateToken,
  validate(updateJobPayloadSchema),
  updateJobById,
);
router.delete("/jobs/:id", authenticateToken, deleteJobById);

export default router;
