// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const path = require('path');
// const fs = require('fs');
// const connectDB = require('./config/db'); // MongoDB connection
// const authRoutes = require('./routes/auth');
// const skillRoutes = require('./routes/skill');
// const formRoutes = require('./routes/formRoutes');
// // const paymentRoutes = require('./routes/paymentRoutes');

// // Initialize the Express app
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(cors()); // Allow cross-origin requests
// app.use(bodyParser.json()); // Parse JSON bodies
// app.use(express.json()); // Parse JSON encoded data

// // Ensure required directories for file uploads exist
// const directories = [
//   path.join(__dirname, 'uploads', 'profilePictures'),
//   path.join(__dirname, 'pdfUploads'), // Directory for PDFs
//   path.join(__dirname, 'imageUploads'), // Directory for Images
// ];

// // Create directories if they don't exist
// directories.forEach((dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// });

// // Serve static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/pdfUploads', express.static(path.join(__dirname, 'pdfUploads')));
// app.use('/imageUploads', express.static(path.join(__dirname, 'imageUploads')));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/skills', skillRoutes);
// app.use('/api/formdata', formRoutes);
// // app.use('/payment', paymentRoutes);

// // Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error('Server error:', err);
//   res.status(500).json({ error: 'Server error' });
// });

// // 404 Error Handling for Undefined Routes
// app.use((req, res, next) => {
//   res.status(404).json({ message: 'Resource not found' });
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db'); // MongoDB connection

// Import Routes
const authRoutes = require('./routes/auth');
const skillRoutes = require('./routes/skill');
const formRoutes = require('./routes/formRoutes');
// const paymentRoutes = require('./routes/paymentRoutes'); Uncomment when needed

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.json()); // Parse JSON encoded data

// Ensure required directories for file uploads exist
const directories = [
  path.join(__dirname, 'uploads', 'profilePictures'),
  path.join(__dirname, 'pdfUploads'), // Directory for PDFs
  path.join(__dirname, 'imageUploads'), // Directory for Images
];
directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/pdfUploads', express.static(path.join(__dirname, 'pdfUploads')));
app.use('/imageUploads', express.static(path.join(__dirname, 'imageUploads')));

// Serve a placeholder for favicon.ico
app.use('/favicon.ico', (req, res) => {
  res.status(204).end(); // Respond with no content
});

// Define Base Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the backend!' });
});

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/formdata', formRoutes);
// app.use('/payment', paymentRoutes); Uncomment when needed

// Error Handling Middleware for Internal Server Errors
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Catch-All Route for Undefined Paths
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
