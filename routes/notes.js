// routes/notesRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const notesController = require('../controllers/notes_controller');
const authenticateToken = require('../middleware/authMiddleware');

router.use(auth);
router.get('/list_note', authenticateToken ,notesController.getNotes);
router.post('/add_note', authenticateToken,notesController.createNote);
router.put('/update_note/:id', authenticateToken,notesController.updateNote);
router.delete('/delete_note/:id', authenticateToken,notesController.deleteNote);

module.exports = router;
