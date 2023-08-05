import { Router } from "express"
import { genSalt, hash } from "bcrypt"
import bcrypt from "bcrypt"
import { isValidObjectId } from "mongoose"
import joi from "joi"
import User from "../../models/User.js"
import Feed from "../../models/Feed.js"
import Comment from "../../models/Comment.js"
import Post from "../../models/Post.js"
import { saveProfilePhotoFile, getProfilePhotoDownloadStreamById, deleteProfilePhotoById } from "../../models/ProfileImage.js"
import { generateAuthToken } from "../../lib/token.js"
import { requireAuthentication } from "../../middleware/auth.js"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import multer from "multer"
import crypto from "node:crypto"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs"

const router = Router()

// register a new user
router.post("/", async function (req, res, next) {
    const schema = joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required(),
    })

    try {
        const { error } = schema.validate(req.body)

        if (error) {
            return res.status(400).json({ error: error.details[0].message })
        }

        const userExistsAlready = await User.findOne({
            email: req.body.email,
        })

        if (userExistsAlready) {
            return res
                .status(403)
                .json({ error: "User with this email already exists!" })
        } else {
            const userToCreate = new User({
                ...req.body,
                password: await bcrypt.hash(req.body.password, 10),
                profilePictureId: ''
            })

            console.log("userToCreate:", userToCreate)

            const createdUser = await userToCreate.save()

            const token = generateAuthToken(createdUser)

            res.status(201).json({
                id: createdUser.id,
                email: createdUser.email,
                name: createdUser.name,
                token: token,
                links: {
                    user: `/users/${createdUser.id}`,
                },
            })
        }
    } catch (err) {
        next(err)
    }
})

// get info about a specific user by id
router.get("/:userid", requireAuthentication, async function (req, res, next) {
    try {
        const user = await User.findById(req.params.userid).select("-password")
        

        if (!user) {
            return res.status(400).json({ error: "User not found" })
        } else {
            const feed = await Feed.findById(process.env.FEED_ID)

            // Filter posts where the authorId matches the user's _id
            const userPosts = feed.posts.filter(post =>
                post.authorId.toString() === req.params.userid.toString()
            )

            return res.status(200).json({
                user: user,
                userPosts: userPosts
            })
        }
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

// delete a specific user by id
router.delete("/:userid", requireAuthentication, async function (req, res, next) {
    // console.log("req.user.id:", req.user._id)
    if (req.user._id === req.params.userid) {
        try {
            const userId = req.params.userid
            const user = await User.findById(req.params.userid)

            if (!user) {
                return next()
            }

            const feed = await Feed.findById(process.env.FEED_ID)
            const userPosts = feed.posts.filter(post =>
                post.authorId.toString() === userId
            )

            // await Post.deleteMany({ _id: { $in: userPostIds } })   //this will work too

            // Delete user's posts from the feed
            for (const post of userPosts) {
                const postId = post._id
                await Post.findByIdAndDelete(postId.toString())

                const postIndex = feed.posts.findIndex(
                    post => post._id.toString() === postId.toString()
                )

                if (postIndex !== -1) {
                    feed.posts.splice(postIndex, 1)
                }
            }

            // Delete the user's comments on every post
            for (const post of feed.posts) {
                const commentsToDelete = post.comments.filter(
                    comment => comment.authorId.toString() === userId
                )

                for (const comment of commentsToDelete) {
                    const commentId = comment._id
                    await Comment.findByIdAndDelete(commentId.toString())

                    const commentIndex = post.comments.findIndex(
                        comment => comment._id.toString() === commentId.toString()
                    )

                    if (commentIndex !== -1) {
                        post.comments.splice(commentIndex, 1)
                    }
                }
            }
            
            await User.findByIdAndDelete(req.params.userid)
            await feed.save()

            res.status(204).end()
        } catch (err) {
            return res.status(500).json({ error: err.message })
        }
    } else {
        res.status(403).json({
            error: `You don't have permissions to delete any other users besides yourself!`,
        })
    }
})

// update user's profile info by id
router.put("/:userid", requireAuthentication, async function (req, res, next) {
    const { name, jobTitle, bio } = req.body
    if (req.user._id === req.params.userid) {
        try {
            const userToUpdate = await User.findById(req.params.userid)

            if (!userToUpdate) {
                return next()
            }

            const updatedUser = await User.findByIdAndUpdate(
                req.params.userid,
                {
                    $set: {
                        name: name || userToUpdate.name,
                        jobTitle: jobTitle || userToUpdate.jobTitle,
                        bio: bio || userToUpdate.bio,
                    },
                },
                { new: true }
            )

            // iterate though the posts and update authorName, and authorJobTitle if they have changed
            await Post.updateMany(
                { authorEmail: userToUpdate.email },
                {
                    $set: {
                        authorName: updatedUser.name,
                        authorJobTitle: updatedUser.jobTitle,
                    },
                }
            )

            await Feed.updateMany(
                { "posts.authorEmail": userToUpdate.email },
                {
                    $set: {
                        "posts.$[post].authorName": updatedUser.name,
                        "posts.$[post].authorJobTitle": updatedUser.jobTitle,
                    },
                },
                { arrayFilters: [{ "post.authorEmail": userToUpdate.email }] }
            )

            return res
                .status(200)
                .json({
                    message: "User info successfully updated!",
                    name: updatedUser.name,
                    jobTitle: updatedUser.jobTitle,
                    bio: updatedUser.bio
                })
        } catch (err) {
            return res.status(500).json({ error: err.message })
        }
    } else {
        res.status(403).json({
            error: `You don't have permissions to update any other users' personal info!`,
        })
    }
})

// get info about all existing users
router.get("/", requireAuthentication, async function (req, res) {
    /*
     * Compute page number based on optional query string parameter `page`.
     * Make sure page is within allowed bounds.
     */
    try {
        const usersLength = await User.countDocuments()

        let page = parseInt(req.query.page) || 1
        const numPerPage = 10
        const lastPage = Math.ceil(usersLength / numPerPage)
        page = page > lastPage ? lastPage : page
        page = page < 1 ? 1 : page
        const start = (page - 1) * numPerPage

        /*
         * Generate HATEOAS links for surrounding pages.
         */
        const links = {}
        if (page < lastPage) {
            links.nextPage = `/users?page=${page + 1}`
            links.lastPage = `/users?page=${lastPage}`
        }
        if (page > 1) {
            links.prevPage = `/users?page=${page - 1}`
            links.firstPage = "/users?page=1"
        }

        const pageUsers = await User.find({})
            .sort({ _id: 1 })
            .skip(start)
            .limit(numPerPage)
            .select("-password")

        /*
         * Construct and send response.
         */
        res.status(200).json({
            users: pageUsers,
            pageNumber: page,
            totalPages: lastPage,
            pageSize: numPerPage,
            totalCount: pageUsers.length,
            links: links,
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
})

router.post("/login", async function (req, res, next) {
    if (req.body && req.body.email && req.body.password) {
        const { email, password } = req.body
        try {
            const user = await User.findOne({ email })
            const authenticated =
                user && (await bcrypt.compare(password, user.password))

            if (authenticated) {
                const token = generateAuthToken(user)
                res.status(200).send({
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    token: token,
                })
            } else if (!user) {
                return res
                    .status(401)
                    .json({ error: "User with the provided email not found!" })
            } else {
                return res
                    .status(401)
                    .json({ error: "Invalid authentication credentials!" })
            }
        } catch (err) {
            return res.status(500).json({ error: err.message })
        }
    } else {
        res.status(400).json({
            error: "Request body requires `email` and `password`.",
        })
    }
})

router.post("/validatetoken", async function (req, res) {
    const authHeader = req.get("Authorization") || ""
    const authHeaderParts = authHeader.split(" ")
    const token = authHeaderParts[0] === "Bearer" ? authHeaderParts[1] : null
  
    if (!token) {
        return res.json({ isAuthenticated: false })
    }
  
    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY)
        res.json({ isAuthenticated: true })
    } catch (err) {
        res.json({ isAuthenticated: false })
    }
})

const imageTypes = {
    "image/jpeg": "jpg",
    "image/png": "png"
}

// Get the current file URL and convert it to a file path
const __filename = fileURLToPath(import.meta.url)

// Get the directory name of the current file
const __dirname = dirname(__filename)

const upload = multer({
    storage: multer.diskStorage({
        destination: `${__dirname}/uploads`,
        filename: (req, file, callback) => {
            const filename = crypto.pseudoRandomBytes(16).toString("hex")
            const extension = imageTypes[file.mimetype]
            callback(null, `${filename}.${extension}`)
        }
    }),
    fileFilter: (req, file, callback) => {
        callback(null, !!imageTypes[file.mimetype])
    }
})

router.post('/profileImage', requireAuthentication, upload.single('file'), async function (req, res, next) {
    // console.log("  -- req.file:", req.file)
    const userid = req.user._id

    const user = await User.findById(userid)

    if (!user) {
        return next()
    }

    if (req.file) {
        try {
            const photo = {
                contentType: req.file.mimetype,
                filename: req.file.filename,
                path: req.file.path,
                userid: userid,
            }

            const id = await saveProfilePhotoFile(photo)

            if (user.profilePictureId) {
                //delete the old picture
                await deleteProfilePhotoById(user.profilePictureId)
            }

            const updatedUser = await User.findByIdAndUpdate(
                userid,
                {
                    $set: {
                        profilePictureId: id
                    },
                },
                { new: true }
            )

            // iterate though the posts and update authorName, and authorJobTitle if they have changed
            await Post.updateMany(
                { authorEmail: updatedUser.email },
                {
                    $set: {
                        profilePictureId: id
                    },
                }
            )

            await Feed.updateMany(
                { "posts.authorEmail": updatedUser.email },
                {
                    $set: {
                        "posts.$[post].authorProfilePictureId": id
                    },
                },
                { arrayFilters: [{ "post.authorEmail": updatedUser.email }] }
            )
            
            // After saving the photo in MongoDB, delete the uploaded image from the local folder
            fs.unlinkSync(req.file.path)

            res.status(201).send({
                id: id
            })
        } catch (err) {
            return res.status(500).json({ error: err.message })
        }
    } else {
        res.status(400).send({
            error: "The photo you upload should be in png/jpeg format!"
        })
    }
})

router.get("/profileImage/:id", requireAuthentication, async function (req, res, next) {
    const profileImageId = req.params.id

    try {
        const downloadStream = await getProfilePhotoDownloadStreamById(profileImageId)

        downloadStream
            .on("error", function (err) {
                if (err.code === "ENOENT") {
                    next()
                } else {
                    return res.status(500).json({ error: err.message })
                }
            })
            .on("file", function (file) {
                res.status(200).type(file.metadata.contentType)
            })
            .pipe(res)
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

router.delete("/profileImage/:id", requireAuthentication, async function (req, res, next) {
    const profilePictureId = req.params.id
    const userid = req.user._id

    const user = await User.findById(userid)

    if (user.profilePictureId === profilePictureId) {
        try {
            const deleted = await deleteProfilePhotoById(profilePictureId)
            if (!deleted) {
                return res.status(404).json({ error: "Profile photo not found" })
            }

            user.profilePictureId = ''
            const updatedUser = await user.save()

            // iterate though the posts and update authorName, and authorJobTitle if they have changed
            await Post.updateMany(
                { authorEmail: updatedUser.email },
                {
                    $set: {
                        profilePictureId: ''
                    },
                }
            )

            await Feed.updateMany(
                { "posts.authorEmail": updatedUser.email },
                {
                    $set: {
                        "posts.$[post].authorProfilePictureId": ''
                    },
                },
                { arrayFilters: [{ "post.authorEmail": updatedUser.email }] }
            )

            return res.status(204).end()
        } catch (err) {
            return res.status(500).json({ error: err.message })
        }
    } else {
        res.status(403).json({
            error: `You don't have permissions to delete profile pictures of other users!`,
        })
    }
})

router.post("/follow/:userid", requireAuthentication, async function (req, res, next) {
    const userid = req.user._id

    if (userid.toString() !== req.params.userid.toString()) {
        try {
            const followerUser = await User.findById(userid)
            const userToFollow = await User.findById(req.params.userid)

            if (!userToFollow) {
                return res.status(404).json({ error: "User to follow not found!" })
            }

            // Check if the user is already being followed
            if (userToFollow.followers.includes(userid)) {
                return res.status(400).json({ error: "You already follow the given user!" })
            }

            userToFollow.followers.push(userid)
            const followedUser = await userToFollow.save()

            followerUser.following.push(followedUser._id)
            const userThatFollowed = await followerUser.save()

            return res.status(200).json({
                message: "User successfully followed!",
                followedUserFollowers: followedUser.followers,
                followerUserFollowings: userThatFollowed.following
            })
        } catch (err) {
            return res.status(500).json({ error: err.message })
        }
    } else {
        return res.status(400).send({
            error: "You can't follow yourself!"
        })
    }
})

router.post("/unfollow/:userid", requireAuthentication, async function (req, res, next) {
    const userid = req.user._id

    if (userid.toString() !== req.params.userid.toString()) {
        try {
            const unfollowerUser = await User.findById(userid)
            const userToUnfollow = await User.findById(req.params.userid)

            if (!userToUnfollow) {
                return res.status(404).json({ error: "User to unfollow not found!" })
            }

            // Check if the user is being followed
            if (!userToUnfollow.followers.includes(userid)) {
                return res.status(400).json({ error: "You don't follow the given user!" })
            }

            // Remove the unfollower from the userToUnfollow's followers array
            const followerIndex = userToUnfollow.followers.indexOf(userid)
            userToUnfollow.followers.splice(followerIndex, 1)
            await userToUnfollow.save()

            // Remove the userToUnfollow from the unfollowerUser's following array
            const followingIndex = unfollowerUser.following.indexOf(req.params.userid)
            unfollowerUser.following.splice(followingIndex, 1)
            await unfollowerUser.save()

            return res.status(200).json({
                message: "User successfully unfollowed!",
                followedUserFollowers: userToUnfollow.followers,
                followerUserFollowings: unfollowerUser.following,
              })
        } catch (err) {
            return res.status(500).json({ error: err.message })
        }
    } else {
        return res.status(400).send({
            error: "You can't unfollow yourself!"
        })
    }
})

router.get("/following/:userid", requireAuthentication, async function (req, res, next) {
    try {
        const user = await User.findById(req.params.userid)

        if (!user) {
            return res.status(404).json({ error: "User not found!" })
        }

        // Get the users that the current user is following
        const following = await User.find({ _id: { $in: user.following } }).select("_id name profilePictureId")

        return res.status(200).json({ following })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})  

router.get("/followers/:userid", requireAuthentication, async function (req, res, next) {
    try {
        const user = await User.findById(req.params.userid)

        if (!user) {
            return res.status(404).json({ error: "User not found!" })
        }

        // Get the followers of the user
        const followers = await User.find({ _id: { $in: user.followers } }).select("_id name profilePictureId")

        return res.status(200).json({ followers })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})
  
export default router
