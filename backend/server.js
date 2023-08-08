import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import morgan from "morgan"
import cors from "cors"
import api from "./api/index.js"
import tracker from "./middleware/tracker.js"
import rateLimit from "express-rate-limit"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,                   // Limit each IP to 100 requests per `window` (here, per 1 minute)
    standardHeaders: true,
})
  
app.disable('x-powered-by')

// Define routes and middleware here
app.use(limiter)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))

if (process.env.NODE_ENV === 'production') {
    app.use(
        cors({
            origin: ['https://linkedlist.onrender.com'],
            credentials: true,
            optionsSuccessStatus: 200,
        }),
    )
} else {
    app.use(cors())
}
  
// Uncomment if you are debugging one of the endpoints:
// app.use(tracker)

app.use("/api", api)

// Default Route
app.get("/", (req, res) => {
    res.send("Hello LinkedList!")
})

/*
 * This route will catch any errors thrown from our API endpoints and return
 * a response with a 500 status to the client.
 */
app.use("*", function (err, req, res, next) {
    if (err) {
        console.error(err)
        res.status(500).send({
            error: err,
        })
    } else {
        next()
    }
})

/*
 * This route will catch any requests made to non-existent endpoints and return
 * a response with a 404 status to the client.
 */
app.use("*", function (req, res, next) {
    res.status(404).json({
        error: "Requested resource " + req.originalUrl + " does not exist",
    })
})

// Connect to the database
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("[Backend ⚡️]: Connected to MongoDB")
    })
    .catch((err) => {
        console.log(err)
    })

// Start the server
app.listen(PORT, () => {
    console.log(`[Backend ⚡️]: Server is running on port ${PORT}`)
})
