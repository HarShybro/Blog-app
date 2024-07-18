import { Router } from "express";
import multer from "multer";
import path from "path";
import { User } from "../models/user.js";

const router = Router();
import { Blog } from "../models/blog.js";
import { Comment } from "../models/comment.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/upload/`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.get("/:id", async (req, res) => {
  console.log("BlogId", req.params.id);
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate(
      "createdBy"
    );
    console.log(blog);
    console.log("Comment", comments);
    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }

    return res.status(200).json({ blog: blog, comments: comments });
  } catch (error) {
    return res.status(500).send({ message: "Server error", error });
  }
});
router.post("/", upload.single("coverImage"), async (req, res) => {
  try {
    const { title, body, email } = req.body;
    console.log("Email:", email);
    // Check if req.file is defined before accessing req.file.filename

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User:", user);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log(req.user);
    const blog = await Blog.create({
      body,
      title,
      createdBy: user._id,
      coverImage: `/upload/${req.file.filename}`,
    });

    console.log("File uploaded successfully:", req.file);

    return res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});

router.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("createdBy");
  return res.json(blogs);
});

router.post("/comment/:blogId", async (req, res) => {
  try {
    const { content, email } = req.body;
    console.log("Content", content);
    console.log("Email", email);
    const blogId = req.params.blogId;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User:", user);

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    await Comment.create({
      content,
      blogId,
      createdBy: user._id,
    });

    return res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});

export default router;
