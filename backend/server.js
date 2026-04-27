const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// MongoDB connection string (hardcoded)
const MONGO_URI = 'mongodb://127.0.0.1:27017/portfolioDB';
// If using Atlas:
// const MONGO_URI = 'mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/portfolioDB?retryWrites=true&w=majority';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // serve your frontend folder

// Connect MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ DB Error:', err));

// Mongoose Schema & Model
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// POST route to handle contact form
app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.json({ success: false, msg: 'All fields required' });
    }

    const contact = new Contact({ name, email, message });
    await contact.save();

    res.json({ success: true, msg: 'Message saved successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
