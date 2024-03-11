const multer = require("multer")
const path = require("path")
const { v4 } = require("uuid");
const User = require("../models/User");


const imageStorage = multer.diskStorage({
    filename: (req, file, cb) => {
        const fileName = v4() + path.extname(file.originalname)
        cb(null, fileName)
    },
    destination: (req, file, cb) => {
        cb(null, "profiles")
    }
})


module.exports = multer({ storage: imageStorage }).single("profile")