const express = require('express');
const router = express.Router();
const pool = require('../db');  // <-- make sure this path matches your db.js location

const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/blogController');

// Existing routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

// ----------------------------------------------
// TEMPORARY SEED ROUTE — DO NOT KEEP PERMANENTLY
// ----------------------------------------------
router.get('/seed/one', async (req, res) => {
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
// ----------------------------------------------

module.exports = router;
