import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
    {
        description: {
            type: String,       //For now, just text posts & porfolio links are allowed, later we'll store resume PDFs using GridFSBuckets
            required: true,
        },
        likes: {
            type: Array,
            required: false,
            default: [],
        },
        dislikes: {
            type: Array,
            required: false,
            default: [],
        },
        authorName: {
            type: String,       //user's name
            required: true,
        },
        authorEmail: {
            type: String,       //user's email
            required: true,
        },
        authorJobTitle: {
            type: String,       //user's title
            required: false,
        },
        authorProfilePicutureId: {
            type: String,       //TODO
            required: false,
        }
    },
    {
        timestamps: true,
    }
)

const Post = mongoose.model("Post", postSchema)

export default Post
