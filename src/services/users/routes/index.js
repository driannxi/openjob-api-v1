import { Router } from "express";
import { createUser, getUserById, getUserProfile} from "../controller/users-controller.js";
import validate from "../../../middlewares/validate.js";
import { userPayloadSchema } from "../../../services/users/validator/schema.js";
import authenticateToken from "../../../middlewares/auth.js";

const router = Router();

router.post("/users", validate(userPayloadSchema), createUser);
router.get("/users/:id", getUserById);
router.get("/profile", authenticateToken, getUserProfile);

export default router;
