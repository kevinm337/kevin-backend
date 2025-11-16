// controllers/blogController.js
const pool = require("../models/db");

// GET /api/blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, content, image_url, created_at, updated_at
       FROM blogs
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GetAllBlogs error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/blogs/:id
exports.getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, title, content, image_url, created_at, updated_at
       FROM blogs
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("GetBlogById error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/blogs  (protected)
exports.createBlog = async (req, res) => {
  const { title, content, image_url } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "title and content are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO blogs (title, content, image_url)
       VALUES ($1, $2, $3)
       RETURNING id, title, content, image_url, created_at, updated_at`,
      [title, content, image_url || null]
    );

    res.status(201).json({
      message: "Blog created successfully",
      blog: result.rows[0],
    });
  } catch (err) {
    console.error("CreateBlog error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /api/blogs/:id  (protected)
exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, image_url } = req.body;

  try {
    const existing = await pool.query(
      "SELECT id FROM blogs WHERE id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const result = await pool.query(
      `UPDATE blogs
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           image_url = COALESCE($3, image_url),
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, title, content, image_url, created_at, updated_at`,
      [title, content, image_url, id]
    );

    res.json({
      message: "Blog updated successfully",
      blog: result.rows[0],
    });
  } catch (err) {
    console.error("UpdateBlog error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /api/blogs/:id  (protected)
exports.deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await pool.query(
      "SELECT id FROM blogs WHERE id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }

    await pool.query("DELETE FROM blogs WHERE id = $1", [id]);

    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("DeleteBlog error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
