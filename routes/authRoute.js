const { signupUser, logOut } = require("../controllers/authController")

const router = require("express").Router()


router

    .post("/signup", signupUser)
    .post("/logout", logOut)


module.exports = router