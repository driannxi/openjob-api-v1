import { Router } from "express";
import {
  uploadDocumentController,
  getAllDocuments,
  viewDocumentById,
  deleteDocument,
} from "../controller/documents-controller.js";
import authenticateToken from "../../../middlewares/auth.js";

const router = Router();

router.get("/documents", getAllDocuments);
router.post("/documents", authenticateToken, uploadDocumentController);
router.delete("/documents/:id", authenticateToken, deleteDocument);
router.get("/documents/:id", viewDocumentById);

export default router;
