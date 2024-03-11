const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")


exports.userProtected = asyncHandler(async (req, res, next) => {
    console.log(req.cookies);
    const { utilizer } = req.cookies
    if (!utilizer) {
        return res.status(401).json({ message: "No cookie found" })
    }

    jwt.verify(utilizer, process.env.JWT_KEY, (err, decode) => {
        if (err) {
            return res.status(401).json({ message: err.message || "cookie expired" })
        }

        req.body.userId = decode.userId
        next()
    })

})

