import express from "express";
import {
  deleteUsersByAdmin,
  getUser,
  getUsers,
  updateUsers,
  countUsersByCity,
  sendEmails,
  changeUserPassword,
  deleteUsers,
} from "../controllers/user.controller.js";
import { verifyToken, verifyAdminToken } from "../middleware/verifyToken.js";
import { validate } from "../validators/validationMiddleware.js";
import {
  validateUserUpdate,
  validatePasswordChange,
  validateUserId,
  validateCityParam,
} from "../validators/userValidator.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", verifyToken, validate(validateUserId), getUser);
router.put("/:id", verifyToken, validate(validateUserUpdate), updateUsers);
router.put(
  "/password-change/:id",
  verifyToken,
  validate(validatePasswordChange),
  changeUserPassword
);
router.delete("/:id", verifyToken, validate(validateUserId), deleteUsers);

router.delete("/admin/:id", validate(validateUserId), deleteUsersByAdmin);
router.get("/count/:city", validate(validateCityParam), countUsersByCity);
router.post(
  "/:id/send-emails/:city",
  verifyAdminToken,
  validate(validateCityParam),
  sendEmails
);

export default router;
