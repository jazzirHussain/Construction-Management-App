import { PROFILE_FOLDER } from '../constants.js';
import UserRepository from '../repository/User.js';
import { getImageFormat, uploadFile } from '../utils/AWS/Upload.js';
import sendResetEmail from '../utils/Email/sendResetEmail.js';
import { randomBytes } from 'crypto'
import hashPassword from '../utils/HashPassword.js';

class UserController {
  // Create a new user
  static async createUser(req, res) {
    try {
      const userData = req.body;
      let profileImage = userData.profileImage
      delete userData.profileImage
      const newUser = await UserRepository.add(userData);

      if (profileImage) {
        profileImage = await uploadFile(
          profileImage,
          process.env.BUCKET_NAME,
          `${PROFILE_FOLDER}/${id}.${getImageFormat(updateData.profileImage)}`
        )
        newUser.profileImage = profileImage
        await newUser.save()
      }
      // if (updateData.profileImage) uploadFile(updateData.profileImage)
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get a user by ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserRepository.findById(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // Get a user by email
  static async getUserByEmail(req, res) {
    try {
      const { email } = req.params;
      const user = await UserRepository.findByEmail(email);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // Get all users with pagination
  static async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const users = await UserRepository.findAll(Number(page), Number(limit));
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update a user by ID
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      if (updateData.profileImage) {
        updateData.profileImage = await uploadFile(
          updateData.profileImage,
          process.env.BUCKET_NAME,
          `${PROFILE_FOLDER}/${id}.${getImageFormat(updateData.profileImage)}`
        )
      }
      const updatedUser = await UserRepository.update(id, updateData);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete a user by ID
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deletedUser = await UserRepository.delete(id);
      res.status(200).json(deletedUser);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // Search users by a single query string (username, email, or mobile)
  static async searchUsers(req, res) {
    try {
      const { queryString } = req.query;
      const { page = 1, limit = 10 } = req.query;
      const result = await UserRepository.search(queryString, Number(page), Number(limit));
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const resetToken = randomBytes(32).toString('hex');
      const resetExpires = Date.now() + 3600000; // 1 hour

      const user = await UserRepository.findByEmail(email)

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await UserRepository.update(user._id, { resetToken, resetExpires })

      await sendResetEmail(user.email, resetToken);

      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  static async verifyResetToken(req, res) {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      const user = await UserRepository.findByToken(token);

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      await UserRepository.update(user._id, { password: newPassword, resetToken: null, resetExpires: null });

      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  static async changePassword(req, res) {
    try {
      const { email, oldPassword, newPassword } = req.body;

      const user = await UserRepository.findByEmail(email);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!await user.comparePassword(oldPassword)) {
        return res.status(400).json({ message: 'Invalid current password' });
      }

      await UserRepository.update(user._id, { password: newPassword });

      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  }
}

export default UserController;
