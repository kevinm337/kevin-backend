const pool = require('../models/db');

// GET ALL POSTS
exports.getAllPosts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM blogs ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Server error while fetching posts' });
  }
};

// GET POST BY ID
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM blogs WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching single post:', err);
    res.status(500).json({ error: 'Server error while fetching post' });
  }
};

// CREATE POST
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    await pool.query(
      'INSERT INTO blogs (title, content) VALUES ($1, $2)',
      [title, content]
    );

    res.json({ message: 'Post added' });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Server error while creating post' });
  }
};

// UPDATE POST
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    await pool.query(
      'UPDATE blogs SET title = $1, content = $2 WHERE id = $3',
      [title, content, id]
    );

    res.json({ message: 'Post updated' });
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ error: 'Server error while updating post' });
  }
};

// DELETE POST
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'DELETE FROM blogs WHERE id = $1',
      [id]
    );

    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'Server error while deleting post' });
  }
};
