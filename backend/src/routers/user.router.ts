import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import { User, UserModel } from '../models/user.model';
import { sample_users } from '../data';
import { HTTP_BAD_REQUEST } from '../constants/http_status';

const router = Router();

// Seed route for initial user setup
router.get('/seed', asyncHandler(async (req, res) => {
  const usersCount = await UserModel.countDocuments();
  if (usersCount > 0) {
    res.send('Seed is already done!');
    return;
  }

  await UserModel.create(sample_users);
  res.send('Seed is done!');
}));

// Login route
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.send(generateTokenResponse(user));
  } else {
    res.status(HTTP_BAD_REQUEST).send('Username or password is invalid!');
  }
}));

// Register route
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, address } = req.body;
  const user = await UserModel.findOne({ email });
  
  if (user) {
    res.status(HTTP_BAD_REQUEST).send('User already exists, please login!');
    return;
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  const newUser: User = {
    id: '',
    name,
    email: email.toLowerCase(),
    password: encryptedPassword,
    address,
    isAdmin: false
  };

  const dbUser = await UserModel.create(newUser);
  res.send(generateTokenResponse(dbUser));
}));

// Get all users (Public access since we're skipping protect/admin)
router.get('/', asyncHandler(async (req, res) => {
  const users = await UserModel.find({});
  res.json(users);
}));

// Add a new user (Admin only, but currently open access)
router.post('/add', asyncHandler(async (req, res) => {
  const { name, email, password, address } = req.body;
  
  // Check if the user already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    res.status(HTTP_BAD_REQUEST).send('User already exists');
    return;
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = new UserModel({
    name,
    email,
    password: encryptedPassword,
    address,
    isAdmin: false
  });

  await user.save();
  res.send(user);
}));

// Delete a user by ID (Public access since we're skipping protect/admin)
router.delete('/delete/:id', asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    res.status(HTTP_BAD_REQUEST).send('User not found');
    return;
  }

  await user.remove();
  res.send({ message: 'User deleted successfully' });
}));

// Generate token response helper function
const generateTokenResponse = (user: User) => {
  const token = jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET!,
    { expiresIn: '30d' }
  );

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    token
  };
};

export default router;
