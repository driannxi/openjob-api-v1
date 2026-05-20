import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controller/categories-controller.js";
import authenticateToken from "../../../middlewares/auth.js";
import validate from "../../../middlewares/validate.js";
import { categoryPayloadSchema } from "../validator/schema.js";

const router = Router();

router.post(
  "/categories",
  authenticateToken,
  validate(categoryPayloadSchema),
  createCategory,
);
router.get("/categories", getAllCategories);
router.get("/categories/:id", getCategoryById);
router.put(
  "/categories/:id",
  authenticateToken,
  validate(categoryPayloadSchema),
  updateCategory,
);
router.delete("/categories/:id", authenticateToken, deleteCategory);

export default router;
