import express from "express";
import {
  deleteAdmin,
  getAdmin,
  getAdmins,
} from "../controllers/admin.controller.js";
import { verifyAdminToken } from "../middleware/verifyToken.js";
import { validate } from "../validators/validationMiddleware.js";
import {
  validateAdminIdParam,
  validateDeleteAdmin,
} from "../validators/adminValidator.js";

const router = express.Router();

router.get("/", getAdmins);
router.get("/profile/", verifyAdminToken, getAdmin);
router.delete(
  "/delete/:id",
  verifyAdminToken,
  validate(validateDeleteAdmin),
  deleteAdmin
);

export default router;
