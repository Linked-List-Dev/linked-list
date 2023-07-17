import { Router } from "express"
import { genSalt, hash } from "bcrypt"
import bcrypt from "bcrypt"
import { isValidObjectId } from "mongoose"
import joi from "joi"
import User from "../../models/User.js"
import Feed from "../../models/Feed.js"
import Post from "../../models/Post.js"
import { generateAuthToken } from "../../lib/token.js"
import { requireAuthentication } from "../../middleware/auth.js"

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
            })

            const createdUser = await userToCreate.save()

            const token = generateAuthToken(createdUser)

            res.status(201).json({
                id: createdUser.id,
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
            return res.status(200).json({
                user: user,
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
            const user = await User.findById(req.params.userid)

            if (!user) {
                return next()
            }

            const userPostIds = user.posts.map((post) => post._id)
            // await Post.deleteMany({ _id: { $in: userPostIds } })   //this will work too

            // Delete user's posts from the feed
            for (const postId of userPostIds) {
                await Post.findByIdAndDelete(postId.toString())

                const feed = await Feed.findById(process.env.FEED_ID)

                const postIndex = feed.posts.findIndex(
                    (post) => post._id.toString() === postId.toString()
                )

                if (postIndex !== -1) {
                    feed.posts.splice(postIndex, 1)
                }

                feed.posts.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )

                await feed.save()
            }

            await User.findByIdAndDelete(req.params.userid)

            res.status(204).end()
        } catch (err) {
            res.status(500).json({
                error: `Failed to delete the user by id due to the following error: ${err.message}`,
            })
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

            if (name && name != "") {
                userToUpdate.name = name
            }
            if (jobTitle && jobTitle != "") {
                userToUpdate.jobTitle = jobTitle
            }
            if (bio && bio != "") {
                userToUpdate.bio = bio
            }
            
            const updatedUser = await userToUpdate.save()

            return res
                .status(200)
                .json({ message: "User info successfully updated!", user: updatedUser })
        } catch (err) {
            res.status(500).json({
                error: `Failed to update the user by id due to the following error: ${err.message}`,
            })
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
        res.status(500).json({
            error: `Failed to retrieve the collection of all the users due to the following error: ${err.message}`,
        })
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
            // next(e)
            res.status(500).json({
                error: `Failed to login the user by id due to the following error: ${err.message}`,
            })
        }
    } else {
        res.status(400).json({
            error: "Request body requires `email` and `password`.",
        })
    }
})

export default router
