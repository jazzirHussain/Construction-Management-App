import express from 'express';
import UserController from '../controllers/User.js';
import checkRoles from '../middlewares/checkRoles.js';
import { ROLE_ADMIN, ROLE_SUPER } from '../constants.js';

const router = express.Router();

// Create a new user
router.post('/',checkRoles([ROLE_ADMIN]), UserController.createUser);

// Search users by a single query string (username, email, or mobile)
router.get('/search', UserController.searchUsers);

// Get a user by ID
router.get('/:id', UserController.getUserById);

// Get a user by email
router.get('/email/:email', UserController.getUserByEmail);

// Get all users with pagination
router.get('/', UserController.getAllUsers);

// Update a user by ID
router.put('/:id', UserController.updateUser);

// Delete a user by ID
router.delete('/:id', checkRoles([ROLE_SUPER]), UserController.deleteUser);

export default router;
