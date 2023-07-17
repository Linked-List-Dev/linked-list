import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import User from "../models/User.js"

dotenv.config()

const requireAuthentication = async (req, res, next) => {
    const authHeader = req.get("Authorization") || ""
    const authHeaderParts = authHeader.split(" ")
    const token = authHeaderParts[0] === "Bearer" ? authHeaderParts[1] : null

    if (!token) {
        return res
            .status(401)
            .json({ error: "Authorization denied - no token provided" })
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = payload.user
        // console.log("req.user:", req.user)
        next()
    } catch (err) {
        res.status(400).json({
            error: "Authorization denied - provided token is either not valid or has expired",
        })
    }
}

export { requireAuthentication }
