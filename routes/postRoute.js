const { getAllPosts, addPosts, deletePost, updatePost } = require("../controllers/userController")
const { userProtected } = require("../middleware/protected")

const router = require("express").Router()


router

    .get("/posts", getAllPosts)
    .post("/add-post", userProtected, addPosts)
    .delete("/delete-post/:postId", userProtected, deletePost)
    .put("/modify-post/:postId", userProtected, updatePost)


module.exports = router