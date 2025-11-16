const express = require('express');
const router = express.Router();
const pool = require('../models/db');  // Correct path to db.js

const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/blogController');


// ======================================================
// 🔍 DEBUG: CHECK EXISTING TABLES IN YOUR DATABASE
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
    res.status(500).json({ error: 'Table check failed' });
  }
});


// ======================================================
// 🔥 TEMPORARY SEED ROUTE — SAFE NAME THAT CANNOT CONFLICT
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
    res.status(500).json({ error: 'Failed to seed blog entry' });
  }
});


// ======================================================
// 📌 BLOG CRUD ROUTES
// ======================================================
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;
