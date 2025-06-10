import express from "express";
import { getEmails, addEmail } from "../controllers/email.controller.js";
import { verifyAdminToken } from "../middleware/verifyToken.js";
import { validate } from "../validators/validationMiddleware.js";
import { validateAddEmail } from "../validators/emailValidator.js";

const router = express.Router();

router.get("/", getEmails);
router.post("/add/", verifyAdminToken, validate(validateAddEmail), addEmail);

export default router;
