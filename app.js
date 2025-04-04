// app.js
const express = require('express');
const app = express();
const urlRoutes = require('./routes/urlRoutes');
require('dotenv').config();

app.use(express.json());


// API Routes
app.use('/', urlRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


require('dotenv').config(); // Load environment variables from .env file

const mongoose = require('mongoose');

// Retrieve the MongoDB URI from environment variables
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('MongoDB connection string is missing. Please check your .env file.');
  process.exit(1); // Exit the process with failure
}

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1); // Exit the process with failure
});
