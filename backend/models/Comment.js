import mongoose from "mongoose"

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        authorName: {
            type: String,       //user's name
            required: true,
        },
        authorId: {
            type: String,
            required: true,
        },
        authorProfilePictureId: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

const Comment = mongoose.model("Comment", commentSchema)

export default Comment
