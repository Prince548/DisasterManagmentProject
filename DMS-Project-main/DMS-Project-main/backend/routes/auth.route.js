import express from "express";
import {
  logoutUser,
  registerUser,
  signinUser,
  registerAdmin,
  signinAdmin,
  logoutAdmin,
} from "../controllers/auth.controller.js";
import { verifyAdminToken } from "../middleware/verifyToken.js";
import { validate } from "../validators/validationMiddleware.js";
import {
  validateUserRegistration,
  validateUserLogin,
  validateAdminLogin,
} from "../validators/authValidator.js";
import { validateAdminCreation } from "../validators/adminValidator.js";

const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/signin", validate(validateUserLogin), signinUser);
router.post("/user/logout", logoutUser);

router.post(
  "/admin/register",
  verifyAdminToken,
  validate(validateAdminCreation),
  registerAdmin
);
router.post("/admin/signin", signinAdmin);
router.post("/admin/logout", logoutAdmin);

export default router;
