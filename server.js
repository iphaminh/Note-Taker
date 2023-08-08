// Importing required modules
const express = require('express'); // Express.js library for server-side operations
const path = require('path'); // Built-in Node.js module for working with file and directory paths
const fs = require('fs'); // Built-in Node.js module for File System operations
const { v4: uuidv4 } = require('uuid'); // UUID library to generate unique IDs

// Creating an instance of an Express app
const app = express();

// Setting up the PORT for server to listen on (either from environment variable or default to 3000)
const PORT = process.env.PORT || 3000;

// Middleware setups
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded request bodies
app.use(express.static('public')); // Middleware to serve static files from the 'public' directory

// API route to get all notes
app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8')); // Read and parse notes from file
    res.json(notes); // Send notes as a JSON response
});

// API route to add a new note
app.post('/api/notes', (req, res) => {
    const newNote = req.body; // Extract new note data from request body
    newNote.id = uuidv4(); // Assign a unique ID to the new note
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8')); // Read and parse current notes from file
    notes.push(newNote); // Add the new note to the notes array
    fs.writeFileSync('./db/db.json', JSON.stringify(notes)); // Write updated notes back to the file
    res.json(newNote); // Send the new note as a JSON response
});

// (Bonus) API route to delete a note by its ID
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id; // Extract the ID from the URL parameters
    let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8')); // Read and parse current notes from file
    notes = notes.filter(note => note.id !== noteId); // Filter out the note with the given ID
    fs.writeFileSync('./db/db.json', JSON.stringify(notes)); // Write updated notes back to the file
    res.json({ message: 'Note deleted' }); // Send a confirmation message as a JSON response
});

// Route to serve the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html')); // Send the 'notes.html' file as a response
});

// Catch-all route to serve the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html')); // If no other route matches, send the 'index.html' file as a response
});

// Starting the Express server on the specified PORT
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Log to console when the server starts
});
