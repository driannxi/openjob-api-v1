import { Router } from "express";
import {
  addBookmark,
  getAllUserBookmarks,
  getBookmarkById,
  deleteBookmark,
} from "../controller/bookmarks-controller.js";
import authenticateToken from "../../../middlewares/auth.js";

const router = Router();

router.get("/bookmarks", authenticateToken, getAllUserBookmarks);
router.post("/jobs/:jobId/bookmark", authenticateToken, addBookmark);
router.delete("/jobs/:jobId/bookmark", authenticateToken, deleteBookmark);
router.get("/jobs/:jobId/bookmark/:id", authenticateToken, getBookmarkById);

export default router;
