const { db } = require('../config/firebase.js');

exports.getNotes = async (req, res) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const uid = req.user.uid;
    const notesRef = db.collection('notes').where('uid', '==', uid);
    const snapshot = await notesRef.get();

    const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get notes' });
  }
};



exports.createNote = async (req, res) => {
  console.log('User:', req.user);
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  try {
    const { title, content } = req.body;
    const uid = req.user.uid;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    if (!req.user || !req.user.uid) {
      return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }


    const note = {
      title,
      content,
      uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('notes').add(note);
    res.status(201).json({ id: docRef.id, ...note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create note' });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const uid = req.user.uid;

console.log('User:', req.user);
console.log('Request body:', req.body);
console.log('Request headers:', req.headers);


    if (!req.user || !req.user.uid) {
      return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const noteDoc = await db.collection('notes').doc(id).get();
    if (!noteDoc.exists) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (noteDoc.data().uid !== uid) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await db.collection('notes').doc(id).update({
      title,
      content,
      updatedAt: new Date().toISOString()
    });

    res.json({ message: 'Note updated' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update note' });
  }
};


exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    const noteDoc = await db.collection('notes').doc(id).get();
    if (!noteDoc.exists) {
      return res.status(404).json({ message: 'Note not found' });
    }
    if (noteDoc.data().uid !== uid) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await db.collection('notes').doc(id).delete();
    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete note' });
  }
};
