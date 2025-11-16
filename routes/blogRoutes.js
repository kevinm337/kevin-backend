const express = require('express');
const router = express.Router();
const pool = require('../db');  // Correct db import

const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/blogController');

// ======================================================
// 🔥 TEMPORARY SEED ROUTE — SPECIAL PATH (CANNOT CONFLICT)
// ======================================================
// This WILL work even if Express routing order changes.
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
// Existing blog CRUD routes
// ======================================================

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;
