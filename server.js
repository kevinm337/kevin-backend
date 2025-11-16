const express = require('express');
const cors = require('cors');
require('dotenv').config();

const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// ✔ Correct route mounting
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Kevin backend is running');
});

app.get('/debug', (req, res) => {
  res.send("Debug route reached ✔");
});

app.listen(8080, () => console.log("Server running on port 8080"));
