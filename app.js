const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/users');
require('./DB')
const cors = require('cors'); // Import cors

const app = express();
app.use(bodyParser.json()); // Parse JSON requests
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Create a new user (POST)
app.post('/users', async (req, res) => {
  const { name, email, age } = req.body;
  try {
    const newUser = new User({ name, email, age });
    await newUser.save();
    res.status(201).json({ message: 'User created', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err });
  }
});

// Get all users (GET)
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
});

// Get a single user by ID (GET)
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err });
  }
});

// Update a user by ID (PUT)
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { name, email, age }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err });
  }
});

// Delete a user by ID (DELETE)
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted', user: deletedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err });
  }
});

  

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
