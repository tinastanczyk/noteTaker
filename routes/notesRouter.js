const fs = require('fs');
const util = require('util');
const express = require('express');
const router = express.Router();
// Helper method for generating unique ids
const uuid = require('../helpers/uuid');
const { json } = require('express');
// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

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
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for a new note
router.post('/', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully 🚀`);
  } else {
    res.error('Error in adding note');
  }
});
// function testNotes(){
//   return JSON.parse(fs.readFileSync('./db/db.json'));
// }
router.delete('/:id', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./db/db.json'));
  const noteExist = notes.filter(note => note.id !== req.params.id);
  writeToFile('./db/db.json', noteExist);
  res.json({ok: true});
})

module.exports = router;