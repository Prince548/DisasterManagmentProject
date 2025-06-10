import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import incidentRoute from "./routes/incident.route.js";
import emailRoute from "./routes/email.route.js";
import adminRoute from "./routes/admin.route.js";
import { errorHandler } from "./validators/validationMiddleware.js";

dotenv.config();
const port = process.env.PORT || 8800;
const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.send("Server is running");
});
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/incidents", incidentRoute);
app.use("/api/emails", emailRoute);
app.use("/api/admins", adminRoute);

// Global error handling middleware (must be after all routes)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
