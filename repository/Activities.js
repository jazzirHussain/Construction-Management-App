import Activity from '../models/Activity.js';
import mongoose from 'mongoose';

class ActivityRepository {

  // Add new activity for a project
  static async addActivity(activityData) {
    try {
      const { project } = activityData
      // Ensure the project is unique in the Activity collection
      const existingActivity = await Activity.findOne({ project: project });
      if (existingActivity) {
        throw new Error('Activity for this project already exists.');
      }

      const activity = new Activity(activityData);
      await activity.save();

      return activity;
    } catch (error) {
      throw new Error(`Error adding activity: ${error.message}`);
    }
  }

  // Delete activity by project ID
  static async deleteActivity(projectId) {
    try {
      const deletedActivity = await Activity.findOneAndDelete({ project: projectId });
      return deletedActivity;
    } catch (error) {
      throw new Error(`Error deleting activity: ${error.message}`);
    }
  }

  static async deleteActivityItem(projectId, itemId) {
    try {
      const result = await this.update(
        { project: projectId },
        { $pull: { activities: { _id: itemId } } },
        { new: true } // Return the updated document
      );

      if (!result) {
        throw new Error('Activity not found');
      }      

      return result;
    } catch (error) {
      throw new Error(`Error deleting activity: ${error.message}`);
    }
  }

  // Get activity by project ID, sort images by date
  static async getActivityByProject(projectId) {
    try {
      const activity = await Activity.findOne({ project: projectId })
      if (!activity) {
        throw new Error('Activity not found for the given project.');
      }
      activity.activities.sort((a, b) => new Date(a.date) - new Date(b.date));
      return activity;
    } catch (error) {
      throw new Error(`Error fetching activity: ${error.message}`);
    }
  }

  static async updateActivityItem(projectId, itemId, activityData) {
    try {
      const updateFields = {};
      for (const key in activityData) {
        if (activityData[key] !== undefined) {
          updateFields[`activities.$.${key}`] = activityData[key];
        }
      }
      const updateQuery = { $set: updateFields }
      
      return await this.update({ project: projectId, "activities._id": itemId }, updateQuery)
    } catch (err) {
      throw new Error(err.message);
    }
  }

  // Update activity by ID
  static async updateActivity(projectId, updateData) {
    try {
      return await this.update({ project: projectId }, updateData);
    } catch (error) {
      throw new Error(`Error updating activity: ${error.message}`);
    }
  }

  static async update(query, updateData) {
    try {
      const updatedActivity = await Activity.findOneAndUpdate(
        query,
        updateData,
        { new: true, runValidators: true }
      ).lean();

      if (updatedActivity) {
        updatedActivity.activities.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
      return updatedActivity;
    } catch (err) {
      throw new Error('Error updating activity: ' + err.message);
    }
  }

  // Update activity images for a given project
  static async addItems(projectId, newActivities) {
    try {
      const activity = await Activity.findOne({ project: projectId });
      if (!activity) {
        throw new Error('Activity not found for the given project.');
      }

      activity.activities.push(...newActivities); // Append new images
      await activity.save();

      return activity;
    } catch (error) {
      throw new Error(`Error updating activity: ${error.message}`);
    }
  }
}

export default ActivityRepository;
