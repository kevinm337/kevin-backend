const express = require('express');
const router = express.Router();
const pool = require('../models/db');  // MUST be correct

const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/blogController');


// ======================================================
// 🔍 1) TEST DB CONNECTION
// Visit: /api/blogs/__dbtest
// ======================================================
router.get('/__dbtest', async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, server_time: result.rows[0] });
  } catch (err) {
    console.error("DB TEST ERROR:", err);
    res.status(500).json({
      error: "DB test failed",
      detail: err.message
    });
  }
});


// ======================================================
// 🔍 2) CHECK EXISTING TABLES
// Visit: /api/blogs/__tables
// ======================================================
router.get('/__tables', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Tables debug error:", err);
    res.status(500).json({ error: 'Table check failed', detail: err.message });
  }
});


// ======================================================
// 🔥 3) TEMP SEED ROUTE
// Visit: /api/blogs/__seed
// ======================================================
router.get('/__seed', async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO blogs (title, content) VALUES ($1, $2) RETURNING *",
      ['First Post!', 'This is my first post on the live backend.']
    );

    res.json({
      message: 'Seed blog created successfully 🎉',
      blog: result.rows[0]
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      error: 'Failed to seed blog entry',
      detail: error.message
    });
  }
});


// ======================================================
// 4) BLOG CRUD ROUTES
// ======================================================
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;
