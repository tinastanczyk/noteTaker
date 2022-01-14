const express = require('express');
const router = express.Router();
const noteRouter = require('./notesRouter');

router.use('/notes', noteRouter);


module.exports = router;