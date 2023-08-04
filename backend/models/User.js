import mongoose from "mongoose"

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
    profilePictureId: {
        type: String,           // Store the link to the profile picture as a string
        default: '',
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    jobTitle: {
        type: String,
        required: false
    },
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
        required: false
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
        required: false
    },
})

const User = mongoose.model("User", userSchema)

export default User
