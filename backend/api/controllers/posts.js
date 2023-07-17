import { Router } from "express"
import { isValidObjectId } from "mongoose"
import joi from "joi"
import User from "../../models/User.js"
import Feed from "../../models/Feed.js"
import Post from "../../models/Post.js"
import { requireAuthentication } from "../../middleware/auth.js"
import dotenv from "dotenv"

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
        //create the post iteslf and save it
        const postToCreate = new Post({
            description: description,
            authorName: username,
            authorEmail: email,
        })

        const createdPost = await postToCreate.save()

        //associate the created post with an author
        const user = await User.findById(userid)
        user.posts.push(createdPost)
        await user.save()

        //save the post in the global feed
        const feed = await Feed.findById(process.env.FEED_ID)
        feed.posts.push(createdPost)
        await feed.save()

        return res.status(200).json({
            id: createdPost._id,
            description: createdPost.description,
            author: createdPost.postedBy,
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
            return res.status(400).json({ error: "Post to upvote not found" })
        }

        postToLike.likes = [...new Set(postToLike.likes)]
        postToLike.dislikes = [...new Set(postToLike.dislikes)]

        const alreadyLiked = postToLike.likes.includes(email)

        if (isDisliked === false && !alreadyLiked) {
            if (isLiked === true) {
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

        return res
            .status(200)
            .json({ message: "Post successfully liked!", post: likedPost })
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

        return res
            .status(200)
            .json({
                message: "Post successfully disliked!",
                post: dislikedPost,
            })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

export default router
