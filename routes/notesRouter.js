const fs = require('fs');
const util = require('util');
// requiring express.Router()
const express = require('express');
const router = express.Router();
// Helper method for generating unique ids
const uuid = require('../helpers/uuid');
const { json } = require('express');
// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);
// HELPER FUNCTIONS
// function to write into file
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
// function to read and append into file
const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

// GET Route for retrieving all the notes
router.get('/', (req, res) => {
  console.info(`${req.method} request received for notes`);
  // reading db.json file, if the data comes through, parse it from the JSON string.
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for a new note
router.post('/', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  // deconstructing req.body to its elements
  const { title, text } = req.body;
  // creating a new note object with new id
  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };
    // appending the newNote to the .json file database
    readAndAppend(newNote, './db/db.json');
    // noting that the appendage was successful
    res.json(`Note added successfully 🚀`);
  } else {
    // shows error if appendage is unsuccessful
    res.error('Error in adding note');
  }
});
// DELETE route when a specific id is passed in
router.delete('/:id', (req, res) => {
  // new variable set to the json parsed data from the .json database
  const notes = JSON.parse(fs.readFileSync('./db/db.json'));
  // return new array called noteExist which only has notes with the id that is not the id passed in
  const noteExist = notes.filter(note => note.id !== req.params.id);
  // write new array of objects into .json database
  writeToFile('./db/db.json', noteExist);
  // refreshes automatically
  res.json({ok: true});
})
// export router to complete current
module.exports = router;