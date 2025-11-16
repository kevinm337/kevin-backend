// blogController.js
const pool = require("./db");

// GET /api/blogs
async function getAllBlogs(req, res) {
  try {
    const result = await pool.query(
      `SELECT b.id,
              b.title,
              b.content,
              b.image_url,
              b.created_at,
              b.updated_at,
              u.username AS author_username
       FROM blogs b
       JOIN users u ON b.author_id = u.id
       ORDER BY b.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GetAllBlogs error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// GET /api/blogs/:id
async function getBlogById(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT b.id,
              b.title,
              b.content,
              b.image_url,
              b.created_at,
              b.updated_at,
              u.username AS author_username
       FROM blogs b
       JOIN users u ON b.author_id = u.id
       WHERE b.id = $1`,
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
}

// POST /api/blogs  (protected)
async function createBlog(req, res) {
  const { title, content, image_url } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "title and content are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO blogs (title, content, image_url, author_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, content, image_url, author_id, created_at, updated_at`,
      [title, content, image_url || null, req.user.id]
    );

    res.status(201).json({
      message: "Blog created successfully",
      blog: result.rows[0],
    });
  } catch (err) {
    console.error("CreateBlog error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// PUT /api/blogs/:id  (protected, owner only)
async function updateBlog(req, res) {
  const { id } = req.params;
  const { title, content, image_url } = req.body;

  try {
    // Check owner
    const existing = await pool.query(
      "SELECT id, author_id FROM blogs WHERE id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (existing.rows[0].author_id !== req.user.id) {
      return res.status(403).json({ error: "You can only edit your own blogs" });
    }

    const result = await pool.query(
      `UPDATE blogs
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           image_url = COALESCE($3, image_url),
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, title, content, image_url, author_id, created_at, updated_at`,
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
}

// DELETE /api/blogs/:id  (protected, owner only)
async function deleteBlog(req, res) {
  const { id } = req.params;

  try {
    const existing = await pool.query(
      "SELECT id, author_id FROM blogs WHERE id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (existing.rows[0].author_id !== req.user.id) {
      return res.status(403).json({ error: "You can only delete your own blogs" });
    }

    await pool.query("DELETE FROM blogs WHERE id = $1", [id]);

    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("DeleteBlog error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
