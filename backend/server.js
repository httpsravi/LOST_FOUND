const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database later)
let users = [];
let lostItems = [];
let claimedItems = [];

// Routes for Authentication

// Register user
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    // Create new user
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password, // In production, hash this!
      createdAt: new Date()
    };

    users.push(newUser);

    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error registering user',
      error: error.message 
    });
  }
});

// Login user
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    if (user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Return user data (in production, create JWT token)
    res.json({ 
      success: true, 
      message: 'Login successful',
      data: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error logging in',
      error: error.message 
    });
  }
});

// Get user by ID
app.get('/api/auth/user/:id', (req, res) => {
  try {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true, 
      data: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user',
      error: error.message 
    });
  }
});

// Routes for Lost Items

// Get all lost items
app.get('/api/items/lost', (req, res) => {
  res.json(lostItems);
});

// Upload lost item
app.post('/api/items/lost', (req, res) => {
  try {
    const { userId, name, email, itemName, description, category, location, dateOfLoss, image } = req.body;

    // Validation
    if (!userId || !name || !email || !itemName || !description || !category || !location || !dateOfLoss) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    const newItem = {
      id: uuidv4(),
      type: 'lost',
      userId,
      name,
      email,
      itemName,
      description,
      category,
      location,
      dateOfLoss,
      image: image || null,
      postedDate: new Date(),
      status: 'active'
    };

    lostItems.push(newItem);
    res.status(201).json({ 
      success: true, 
      message: 'Lost item posted successfully',
      data: newItem 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error uploading lost item',
      error: error.message 
    });
  }
});

// Routes for Claiming Items

// Get all claims
app.get('/api/items/claims', (req, res) => {
  res.json(claimedItems);
});

// Claim lost item
app.post('/api/items/claim', (req, res) => {
  try {
    const { userId, name, email, lostItemId, description, contactDetails } = req.body;

    // Validation
    if (!userId || !name || !email || !lostItemId || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    const claim = {
      id: uuidv4(),
      type: 'claim',
      userId,
      name,
      email,
      lostItemId,
      description,
      contactDetails,
      claimDate: new Date(),
      status: 'pending'
    };

    claimedItems.push(claim);

    // Update lost item status
    const item = lostItems.find(i => i.id === lostItemId);
    if (item) {
      item.status = 'claimed';
    }

    res.status(201).json({ 
      success: true, 
      message: 'Claim submitted successfully',
      data: claim 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error submitting claim',
      error: error.message 
    });
  }
});

// Get specific lost item
app.get('/api/items/lost/:id', (req, res) => {
  const item = lostItems.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ 
      success: false, 
      message: 'Item not found' 
    });
  }
  res.json(item);
});

// Get claims for a specific lost item
app.get('/api/items/lost/:id/claims', (req, res) => {
  const claims = claimedItems.filter(c => c.lostItemId === req.params.id);
  res.json(claims);
});

// Delete lost item (mark as resolved)
app.put('/api/items/lost/:id', (req, res) => {
  try {
    const item = lostItems.find(i => i.id === req.params.id);
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found' 
      });
    }

    item.status = req.body.status || 'resolved';
    res.json({ 
      success: true, 
      message: 'Item updated successfully',
      data: item 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating item',
      error: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
