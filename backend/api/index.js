/*
 * This file is the entry point for all API routes.
 * It is responsible for importing all routes and exporting them as a single module.
 * This file is imported in server.js and mounted on the /api path.
 */

import { Router } from "express";
import users from "./controllers/users.js";

const router = Router();

router.use("/users", users);

export default router;