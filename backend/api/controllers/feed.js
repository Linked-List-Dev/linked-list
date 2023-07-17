import { Router } from "express"
import Feed from "../../models/Feed.js"
import dotenv from "dotenv"
import { requireAuthentication } from "../../middleware/auth.js"

dotenv.config()

const router = Router()

// This code will never be used in production as the feed is only published once. Uncomment and post if you need
// to erase the old global feed and create a new one (afterwards update the generated feed id in the .env file):
/*
router.post("/", async (req, res) => {
    try {
        const feedToCreate = await Feed.create({ posts: [] })
        const createdFeed = await feedToCreate.save()
        return res.status(200).json({ id: createdFeed._id })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})
*/

function sortPostsByCreatedAt(posts) {
    return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

// get all the posts made in the global feed
router.get("/", requireAuthentication, async function (req, res, next) {
    try {
        const feed = await Feed.findById(process.env.FEED_ID)
            .lean()   
            .exec();

        if (!feed || feed.length === 0) {
            return res.status(200).json({ posts: [] })
        }

        const sortedPosts = sortPostsByCreatedAt(feed.posts)

        return res.status(200).json({ posts: sortedPosts })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

export default router
