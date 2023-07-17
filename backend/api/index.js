/*
 * This file is the entry point for all API routes.
 * It is responsible for importing all routes and exporting them as a single module.
 * This file is imported in server.js and mounted on the /api path.
 */

import { Router } from "express"
import users from "./controllers/users.js"
import posts from "./controllers/posts.js"
import feed from "./controllers/feed.js"

const router = Router()

router.use("/users", users)
router.use("/posts", posts)
router.use("/feed", feed)

export default router
