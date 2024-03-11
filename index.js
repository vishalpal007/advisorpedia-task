const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const path = require("path")
const cookieParser = require("cookie-parser")
require("dotenv").config({ path: "./.env" })



mongoose.connect(process.env.MONGO_URL)

const app = express()

app.use(express.static("posts"))
app.use(express.static("profiles"))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "dist")))


app.use(cors({
    origin: "https://advisorpedia-task.onrender.com",
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", require("./routes/authRoute"))
app.use("/api/user", require("./routes/postRoute"))


app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"))
    res.status(404).json({ message: "No resource found" })
})

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message || "Internal server error" })
})


mongoose.connection.once("open", () => {
    console.log("MONGOOSE CONNECTED")
    app.listen(process.env.PORT, console.log("server running"))
})

