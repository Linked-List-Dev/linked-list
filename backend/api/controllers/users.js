import { Router } from "express";
import { User } from "../../models/User.js";

const router = Router();

router.post("/", async function (req, res, next) {
    console.log("in users /post, req.body:", req.body)
    res.status(201).json("/post user");
})

export default router;