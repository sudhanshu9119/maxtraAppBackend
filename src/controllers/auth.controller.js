const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

const register = async (req, res, next) => {
  console.log('Register request received:', req.body);
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    console.log('Creating user...');
    const user = await User.create({ username, email, password });
    console.log('User created:', user._id);

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: { id: user._id, username: user.username, email: user.email }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Use .select('+password') because password is excluded by default in the schema
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { id: user._id, username: user.username, email: user.email }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
