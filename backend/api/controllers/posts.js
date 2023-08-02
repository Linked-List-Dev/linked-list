import { Router } from "express"
import { isValidObjectId } from "mongoose"
import joi from "joi"
import User from "../../models/User.js"
import Feed from "../../models/Feed.js"
import Post from "../../models/Post.js"
import Comment from "../../models/Comment.js"
import { requireAuthentication } from "../../middleware/auth.js"
import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

const router = Router()

router.post("/", requireAuthentication, async function (req, res, next) {
    const userid = req.user._id
    const username = req.user.name
    const email = req.user.email

    // console.log("userid:", userid)
    // console.log("username:", username)

    const { description } = req.body

    if (!description) {
        return res
            .status(400)
            .json({ error: "post description must be provided" })
    }

    try {
        const user = await User.findById(userid)

        //create the post iteslf and save it
        const postToCreate = new Post({
            description: description,
            authorName: username,
            authorEmail: email,
            authorJobTitle: user.jobTitle ? user.jobTitle : "looking for job",
            authorProfilePictureId: user.profilePictureId ? user.profilePictureId : "",
            authorId: userid,
        })

        const createdPost = await postToCreate.save()

        //associate the created post with an author
        user.posts.push(createdPost)
        await user.save()

        //save the post in the global feed
        const feed = await Feed.findById(process.env.FEED_ID)
        feed.posts.push(createdPost)
        await feed.save()

        return res.status(200).json({
            id: createdPost._id,
            description: createdPost.description,
            author: createdPost.authorName,
            authorJobTitle: createdPost.authorJobTitle,
            authorProfilePictureId: createdPost.authorProfilePictureId,
            authorId: userid,
        })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

router.put("/:postid", requireAuthentication, async function (req, res, next) {
    const email = req.user.email
    const userid = req.user._id

    const { description } = req.body

    if (!req.params.postid) {
        return res.status(400).json({ error: "Post ID not provided" })
    }

    try {
        const postToEdit = await Post.findById(req.params.postid)
        if (!postToEdit) {
            return next()
        }

        if (email !== postToEdit.authorEmail) {
            return res
                .status(401)
                .json({ error: "You can only edit your own posts!" })
        }
        postToEdit.description = description

        // update the post in the global feed
        const feed = await Feed.findById(process.env.FEED_ID)

        const postIndexInFeed = feed.posts.findIndex(
            (post) => post._id.toString() === req.params.postid.toString()
        )

        if (postIndexInFeed !== -1) {
            feed.posts[postIndexInFeed] = postToEdit
        }

        // update the post within the user's profile page
        const user = await User.findById(userid)
        const postIndexInProfile = user.posts.findIndex(
            (post) => post._id.toString() === req.params.postid.toString()
        )

        if (postIndexInProfile !== -1) {
            user.posts[postIndexInProfile] = postToEdit
        }

        await user.save()
        await feed.save()
        const editedPost = await postToEdit.save()

        return res
            .status(200)
            .json({ message: "Post successfully edited!", post: editedPost })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

// get info about a specific post by post id
router.get("/:postid", requireAuthentication, async function (req, res, next) {
    if (!req.params.postid) {
        return res.status(400).json({ error: "Post ID not provided" })
    }

    try {
        const post = await Post.findById(req.params.postid)

        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        } else {
            return res.status(200).json({
                post: post,
            })
        }
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

router.delete("/:postid", requireAuthentication, async function (req, res, next) {
    const email = req.user.email
    const userid = req.user._id

    if (!req.params.postid) {
        return res.status(400).json({ error: "Post ID not provided" })
    }

    try {
        const post = await Post.findById(req.params.postid)
        if (!post) {
            return next()
        }

        if (email !== post.authorEmail) {
            return res
                .status(401)
                .json({ error: "You can only delete your own posts!" })
        }

        // delete the post from the global feed
        const feed = await Feed.findById(process.env.FEED_ID)

        const postIndex = feed.posts.findIndex(
            (post) => post._id.toString() === req.params.postid.toString()
        )

        if (postIndex !== -1) {
            feed.posts.splice(postIndex, 1)
        }

        feed.posts.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

        await feed.save()

        const user = await User.findById(userid)

        const postIndexInUser = user.posts.findIndex(
            (userPost) => userPost._id.toString() === req.params.postid.toString()
        )
        if (postIndexInUser !== -1) {
            user.posts.splice(postIndexInUser, 1)
        }

        await user.save()

        await Post.findByIdAndDelete(req.params.postid)

        res.status(204).end()
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

router.post("/like/", requireAuthentication, async function (req, res, next) {
    const email = req.user.email
    const { postId, isLiked, isDisliked } = req.body

    try {
        const postToLike = await Post.findById(postId)

        // console.log("postToLike before the update:", postToLike)

        if (!postToLike) {
            return res.status(400).json({ error: "Post to like not found" })
        }

        postToLike.likes = [...new Set(postToLike.likes)]
        postToLike.dislikes = [...new Set(postToLike.dislikes)]

        const alreadyLiked = postToLike.likes.includes(email)

        if (isLiked === false && !alreadyLiked) {
            if (isDisliked === true) {
                // postToLike.dislikes -= 1
                const dislikeIndex = postToLike.dislikes.indexOf(email)
                if (dislikeIndex !== -1) {
                    postToLike.dislikes.splice(dislikeIndex, 1)
                }
            }
            // postToLike.likes += 1
            postToLike.likes.push(email)
        } else {
            // postToLike.likes -= 1
            const likeIndex = postToLike.likes.indexOf(email)
            if (likeIndex !== -1) {
                postToLike.likes.splice(likeIndex, 1)
            }
        }

        const feed = await Feed.findOne({ _id: process.env.FEED_ID })
        const postIndex = feed.posts.findIndex(
            (post) => post._id.toString() === postId.toString()
        )
        feed.posts[postIndex] = postToLike

        // console.log("postToLike after the update:", postToLike)

        await feed.save()
        const likedPost = await postToLike.save()

        return res.status(200).json({
            message: "Post successfully liked!",
            postId: likedPost._id,
            likes: likedPost.likes,
            dislikes: likedPost.dislikes,
        })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

router.post("/dislike/", requireAuthentication, async function (req, res, next) {
    const email = req.user.email
    const { postId, isLiked, isDisliked } = req.body

    try {
        const postToDislike = await Post.findById(postId)
        // console.log("postToDislike before:", postToDislike)

        if (!postToDislike) {
            return res
                .status(400)
                .json({ error: "Post to dislike not found" })
        }

        postToDislike.likes = [...new Set(postToDislike.likes)]
        postToDislike.dislikes = [...new Set(postToDislike.dislikes)]

        const alreadyDisliked = postToDislike.dislikes.includes(email)

        if (isDisliked === false && !alreadyDisliked) {
            if (isLiked === true) {
                // postToDislike.likes -= 1
                const upvoteIndex = postToDislike.likes.indexOf(email)
                if (upvoteIndex !== -1) {
                    postToDislike.likes.splice(upvoteIndex, 1)
                }
            }
            // postToDislike.dislikes += 1
            postToDislike.dislikes.push(email)
        } else {
            //postToDislike.dislikes -= 1
            const dislikeIndex = postToDislike.dislikes.indexOf(email)
            if (dislikeIndex !== -1) {
                postToDislike.dislikes.splice(dislikeIndex, 1)
            }
        }

        // console.log("postToDislike after update:", postToDislike)

        const feed = await Feed.findOne({ _id: process.env.FEED_ID })
        const postIndex = feed.posts.findIndex(
            (post) => post._id.toString() === postId.toString()
        )
        feed.posts[postIndex] = postToDislike

        await feed.save()
        const dislikedPost = await postToDislike.save()

        return res.status(200).json({
            message: "Post successfully disliked!",
            postId: dislikedPost._id,
            likes: dislikedPost.likes,
            dislikes: dislikedPost.dislikes,
        })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

router.post("/comment/", requireAuthentication, async function (req, res, next) {
    const userid = req.user._id
    const username = req.user.name
    const email = req.user.email

    const { postId, commentContent } = req.body

    try {
        const postToCommentOn = await Post.findById(postId)

        if (!postToCommentOn) {
            return res
                .status(400)
                .json({ error: "Post to comment on not found!" })
        }

        // Create a new comment
        const commentToCreate = new Comment({
            content: commentContent,
            authorName: username,
            authorId: userid,
        })

        const newComment = await commentToCreate.save()

        // Push the new comment into the post.comments array
        postToCommentOn.comments.push(newComment)

        // Save the updated post for feed
        const updatedPost = await postToCommentOn.save()

        const feed = await Feed.findOne({ _id: process.env.FEED_ID })
        const postIndex = feed.posts.findIndex(
            (post) => post._id.toString() === postId.toString()
        )
        feed.posts[postIndex] = updatedPost

        await feed.save()

        // Save the updated post for user record
        const user = await User.findById(userid)
        const userPostIndex = user.posts.findIndex(
            (post) => post._id.toString() === postId.toString()
        )

        user.posts[userPostIndex] = updatedPost
        await user.save()

        return res.status(200).json({
            message: "New comment successfully added!",
            id: newComment._id,
            post: updatedPost,
        })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

router.put("/comment/:commentid", requireAuthentication, async function (req, res, next) {
    const userid = req.user._id
    const username = req.user.name
    const email = req.user.email

    const commentId = req.params.commentid
    const { newCommentContent } = req.body

    try {
        const commentToUpdate = await Comment.findById(commentId)

        if (!commentToUpdate) {
            return res
                .status(400)
                .json({ error: "Comment to update not found!" })
        }

        if (commentToUpdate.authorId.toString() !== userid.toString()) {
            return res
                .status(401)
                .json({ error: "You can only edit your own comments!" })
        }

        commentToUpdate.content = newCommentContent

        // Save the updated comment
        const updatedComment = await commentToUpdate.save();

        // Find the post that contains the updated comment
        const postContainingComment = await Post.findOne({ "comments._id": commentId })
        // Update the comment content within the post's comments array
            const updatedPostComments = postContainingComment.comments.map((comment) =>
            comment._id.toString() === commentId ? { ...comment, content: updatedComment.content } : comment
        )
        postContainingComment.comments = updatedPostComments

        // Save the updated post
        const updatedPost = await postContainingComment.save()

        const feed = await Feed.findOne({ _id: process.env.FEED_ID })
        const postIndex = feed.posts.findIndex(
            (post) => post._id.toString() === postContainingComment._id.toString()
        )
        feed.posts[postIndex] = updatedPost

        await feed.save()

        // Save the updated post for user record
        const user = await User.findById(userid)
        const userPostIndex = user.posts.findIndex(
            (post) => post._id.toString() === updatedPost._id.toString()
        )
        user.posts[userPostIndex] = updatedPost
        await user.save()

        return res.status(200).json({
            message: "Comment successfully updated!",
            updatedComment,
        })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

router.delete("/comment/:commentid", requireAuthentication, async function (req, res, next) {
    const userid = req.user._id
    const commentId = req.params.commentid

    console.log("commentId", commentId)
    try {
        const commentToDelete = await Comment.findById(commentId)
        
        if (!commentToDelete) {
            return res
                .status(400)
                .json({ error: "Comment to delete not found!" })
        }

        if (commentToDelete.authorId.toString() !== userid.toString()) {
            return res
                .status(401)
                .json({ error: "You can only delete your own comments!" })
        }

        const postContainingComment = await Post.findOne({ "comments._id": commentId });

        const commentIndex = postContainingComment.comments.findIndex(
            (comment) => comment._id.toString() === commentId.toString()
        )

        if (commentIndex !== -1) {
            postContainingComment.comments.splice(commentIndex, 1)
        }

         // Save the updated post
         const updatedPost = await postContainingComment.save()

        const feed = await Feed.findOne({ _id: process.env.FEED_ID })
        const postIndex = feed.posts.findIndex(
            (post) => post._id.toString() === updatedPost._id.toString()
        )
        feed.posts[postIndex] = updatedPost
        await feed.save()

        // Save the updated post for user record
        const user = await User.findById(userid)
        const userPostIndex = user.posts.findIndex(
            (post) => post._id.toString() === updatedPost._id.toString()
        )
        user.posts[userPostIndex] = updatedPost
        await user.save()

        await Comment.findByIdAndDelete(commentId)

        res.status(204).end()
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

export default router
