const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const path = require("path")
const fs = require("fs/promises")
const validator = require("validator")
const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const profileUpload = require("../utils/profileUpload")



exports.signupUser = asyncHandler(async (req, res) => {

    profileUpload(req, res, async (err) => {
        console.log(req.body);
        if (err) {
            return res.status(400).json({ message: err.message || "unable to upload image" })
        }

        const { name, email, password } = req.body

        if (validator.isEmpty(name)) {
            return res.status(400).json({ message: "Name must be required " })
        }
        if (validator.isEmpty(email)) {
            return res.status(400).json({ message: "email must be required " })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Plase enter valid email " })
        }
        if (validator.isEmpty(password)) {
            return res.status(400).json({ message: "password must be required " })
        }



        const result = await User.findOne({ email })
        // login
        if (result) {

            // await fs.unlink(path.join(__dirname, "..", "profiles", result.profile))
            // update image
            await User.findByIdAndUpdate(result._id, { profile: req.file.filename })
            const compare = await bcrypt.compare(password, result.password)
            if (!compare) {
                return res.status(400).json({ message: "Invalid credentials" })
            }
            const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "7d" })
            res.cookie("utilizer", token, { maxAge: 60 * 60 * 60 * 24 })
            return res.status(200).json({ message: "Login Success", result: { name: result.name, email: result.name, profile: req.file.filename } })

        } else {
            // register

            const hashPass = await bcrypt.hash(password, 10)

            const result = await User.create({ name, email, profile: req.file.filename, password: hashPass })
            const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "7d" })
            res.cookie("utilizer", token, { maxAge: 60 * 60 * 60 * 24 })
            return res.status(200).json({ message: "Register success", result: { name, email, profile: req.file.filename } })

        }





    })

})



exports.logOut = asyncHandler(async (req, res) => {
    res.clearCookie("utilizer")
    res.status(200).json({ message: "Log out success" })
})





