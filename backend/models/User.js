import mongoose from "mongoose"
import Post from "./Post.js"

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    posts: {
        type: [Post.Schema],
        default: [],
    },
})

const User = mongoose.model("User", userSchema)

export default User
