import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import userRouter from "./src/routes/user.js";
import connnectDB from "./db.js";
import { validateToken } from "./services/authenicaton.js";
import router from "./src/routes/blog.js";

import { Blog } from "./src/models/blog.js";

// const cors = require('cors')

import dotenv from "dotenv";
dotenv.config();

// require("dotenv").config();

const app = express();

connnectDB();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use import.meta.url to get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the public directory
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/home", async (req, res) => {
  const allBlogs = await Blog.find({});
  return res.status(200).json({ user: req.user, blogs: allBlogs });
});

app.use("/user", userRouter);

app.use("/blog", router);

app.listen(process.env.PORT, () => {
  console.log("Server started at PORT: ", process.env.PORT);
});
