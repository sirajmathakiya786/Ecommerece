const express = require('express');
const router = express.Router();
const books = require('../controller/books');

router.get('/get', books.fetchBooks);


module.exports = router;