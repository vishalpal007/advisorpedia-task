const asyncHandler = require("express-async-handler")
const Posts = require("../models/Posts")
const validator = require("validator")
const postUpload = require("../utils/postUpload")
const fs = require("fs/promises")
const path = require("path")

exports.getAllPosts = asyncHandler(async (req, res) => {
    const { LIMIT, PAGE } = req.query
    console.log(LIMIT, PAGE);
    const total = await Posts.countDocuments()
    const result = await Posts.find().skip(PAGE * LIMIT).limit(LIMIT)

    res.json({ message: "All Post fetch success", result, total })
})


exports.addPosts = asyncHandler(async (req, res) => {

    postUpload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        const { title, desc } = req.body
        if (validator.isEmpty(title) || validator.isEmpty(desc)) {
            return res.status(400).json({ message: "All fields are required" })
        }

        await Posts.create({ title, desc, hero: req.file.filename })
        res.json({ message: "Post add  success" })

    })
})


exports.deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params
    const result = await Posts.findById(postId)
    if (!result) {
        return res.status(400).json({ message: "No post found" })
    }

    await fs.unlink(path.join(__dirname, "..", "posts", result.hero))
    await Posts.findByIdAndDelete(postId)
    res.json({ message: "Post delete success" })
})



exports.updatePost = asyncHandler(async (req, res) => {

    postUpload(req, res, async (err) => {
        console.log(req.body);
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        const { title, desc, newHero } = req.body
        const { postId } = req.params
        const result = await Posts.findById(postId)
        if (!result) {
            return res.status(400).json({ message: "No post found" })
        }

        if (newHero) {
            await fs.unlink(path.join(__dirname, "..", "posts", result.hero))
            const updateObj = {}
            if (title) {
                updateObj.title = title
            }
            if (title) {
                updateObj.desc = desc
            }
            await Posts.findByIdAndUpdate(postId, ({ ...updateObj, hero: req.file.filename }))
            return res.json({ message: "Post update success" })
        } else {
            const updateObj = {}
            if (title) {
                updateObj.title = title
            }
            if (title) {
                updateObj.desc = desc
            }
            await Posts.findByIdAndUpdate(postId, (updateObj))
        }


    })
})




