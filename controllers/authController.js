import Account from '../models/Account.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

// Register a new user
export const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await Account.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    const user = new Account({ username, password });
    await user.save();

    res.status(201).json({
      _id: user._id,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Account.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
