import mongoose from "mongoose"
import Comment from './Comment.js'

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
        authorId: {
            type: String,
            required: true,
        },
        authorJobTitle: {
            type: String,       //user's title
            required: false,
        },
        authorProfilePictureId: {
            type: String,
            required: false,
            default: ''
        },
        comments: {
            type: [Comment.schema],
            required: false,
        },
    },
    {
        timestamps: true,
    }
)

const Post = mongoose.model("Post", postSchema)

export default Post
