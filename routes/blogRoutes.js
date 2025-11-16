// blogRoutes.js
const express = require("express");
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("./blogController");
const { authenticate } = require("./authController");

const router = express.Router();

// Public
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

// Protected
router.post("/", authenticate, createBlog);
router.put("/:id", authenticate, updateBlog);
router.delete("/:id", authenticate, deleteBlog);

module.exports = router;
