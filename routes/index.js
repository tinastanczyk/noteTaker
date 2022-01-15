// using express.Router() to link the routes
const express = require('express');
const router = express.Router();
// requiring notesRouter.js 
const noteRouter = require('./notesRouter');
// /notes path links to notesRouter.js
router.use('/notes', noteRouter);

// exporting router
module.exports = router;