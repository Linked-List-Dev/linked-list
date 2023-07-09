import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const generateAuthToken = function (user) {
    return jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
        expiresIn: "24h",
    })
}

export { generateAuthToken }
