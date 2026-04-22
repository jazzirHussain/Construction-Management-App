import User from '../models/User.js'; // Adjust the path to your User model
import hashPassword from '../utils/HashPassword.js';

class UserRepository {
  // Create a new user
  static async add(userData) {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      throw new Error(`Error adding user: ${error.message}`);
    }
  }

  // Find user by ID
  static async findById(userId, getDeleted=false) {
    try {
      return await this.find({ _id: userId }, getDeleted);
    } catch (error) {
      throw new Error(`Error finding user: ${error}`);
    }
  }

  // Find user by Email
  static async findByEmail(email, getDeleted=false) {
    try {
      return await this.find({ email: email }, getDeleted);
    } catch (error) {
      throw new Error(`Error finding user: ${error}`);
    }
  }

  // Find user by Email
  static async findByToken(token, getDeleted=false) {
    try {
      return await this.find({ resetToken: token, resetExpires: { $gt: Date.now() } }, getDeleted);
    } catch (error) {
      throw new Error(`Error finding user: ${error}`);
    }
  }

  static async find(query, getDeleted) {
    try {
      if(!getDeleted) query.status = "active"
      
      const user = await User.findOne(query);
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  // Find all users (with optional pagination)
  static async findAll() {
    try {
      const users = await User.find()
        // .skip((page - 1) * limit)
        // .limit(limit)
        .exec();
      // const total = await User.countDocuments();

      return {
        users,
        // total,
        // page,
        // totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Error finding users: ${error.message}`);
    }
  }

  // Update user by ID
  static async update(userId, updateData) {
    try {
      if (updateData.password) {
        updateData.password = await hashPassword(updateData.password);
      }
      const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  // Delete user by ID
  static async delete(userId) {
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  static async search(queryString, page = 1, limit = 10) {
    try {
      // Define regular expression for case-insensitive search
      if (page = 0) limit = 0
      const regex = new RegExp(queryString, 'i');

      // Build the search query for username, email, or mobile
      const searchQuery = {
        $or: [
          { username: regex },
          { email: regex },
          { mobile: regex }
        ]
      };

      // Execute the query with pagination
      const users = await User.find(searchQuery)
        .skip((page - 1) * limit) // Skip the number of documents based on the page number
        .limit(limit) // Limit the number of documents returned
        .exec();

      // Get the total count of matching users
      const total = await User.countDocuments(searchQuery);

      return {
        users,
        total,
        page,
        totalPages: !limit ? 0 : Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Error searching users: ${error.message}`);
    }
  }
}

export default UserRepository;
