import { Router } from "express";
import {
  applyJob,
  getAllApplications,
  getApplicationById,
  getApplicationsByUserId,
  getApplicationsByJobId,
  updateApplicationStatus,
  deleteApplication,
} from "../controller/applications-controller.js";
import authenticateToken from "../../../middlewares/auth.js";
import validate from "../../../middlewares/validate.js";
import {
  applicationPayloadSchema,
  updateStatusPayloadSchema,
} from "../validator/schema.js";

const router = Router();

router.post(
  "/applications",
  authenticateToken,
  validate(applicationPayloadSchema),
  applyJob,
);
router.get("/applications", authenticateToken, getAllApplications);
router.get(
  "/applications/user/:userId",
  authenticateToken,
  getApplicationsByUserId,
);
router.get("/applications/job/:jobId", authenticateToken, getApplicationsByJobId);
router.get("/applications/:id", authenticateToken, getApplicationById);
router.put(
  "/applications/:id",
  authenticateToken,
  validate(updateStatusPayloadSchema),
  updateApplicationStatus,
);
router.delete("/applications/:id", authenticateToken, deleteApplication);

export default router;
