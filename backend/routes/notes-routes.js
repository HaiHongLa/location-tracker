const express = require("express");
const notesController = require("../controllers/notes");

const router = express.Router();

router.get("/getAllNotes/:uid", notesController.getAllNotes);
router.post("/createNote", notesController.createNote);
router.patch("/updateNote", notesController.updateNote);
router.delete("/deleteNote", notesController.deleteNote);

module.exports = router;
