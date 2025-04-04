// routes/urlRoutes.js
const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

// Endpoint for creating a short URL
router.post('/api/url/shorten', urlController.shortenUrl);

// Endpoint for redirection
router.get('/:shortCode', urlController.redirectUrl);

module.exports = router;
