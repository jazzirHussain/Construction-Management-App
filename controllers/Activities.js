import { ACTIVITY_FOLDER } from '../constants.js';
import ActivityRepository from '../repository/Activities.js';
import { getImageFormat, uploadFile } from '../utils/AWS/Upload.js';

class ActivityController {

  // Add activity
  static async add(req, res) {
    const activityData = req.body;
    try {
      const activity = await ActivityRepository.addActivity(activityData);
      return res.status(201).json({ message: 'Activity added successfully', activity });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Delete activity by project ID
  static async deleteActivity(req, res) {
    const { projectId } = req.params;
    try {
      const deletedActivity = await ActivityRepository.deleteActivity(projectId);
      return res.status(200).json({ message: 'Activity deleted successfully', deletedActivity });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Get activity by project ID
  static async getActivityByProject(req, res) {
    const { projectId } = req.params;
    try {
      const activity = await ActivityRepository.getActivityByProject(projectId);
      return res.status(200).json({ activity });
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  // Update activity
  static async updateActivity(req, res) {
    const { projectId } = req.params
    const updateData = req.body;
    try {
      if (updateData?.activities) {
        updateData.activities = await processActivities(updateData.activities, projectId)
      }
      const updatedActivity = await ActivityRepository.updateActivity(projectId, updateData);
      return res.status(200).json({ message: 'Activity updated successfully', updatedActivity });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Update a timeline
  static async updateActivityItem(req, res) {
    try {
      const { projectId, itemId } = req.params;
      const updateData = req.body;

      if (updateData.image) {
        updateData.image = await uploadActivityImage(updateData, Date.now(), projectId)
      }
      const updatedActivity = await ActivityRepository.updateActivityItem(projectId, itemId, updateData);

      if (!updatedActivity) {
        return res.status(404).json({ message: 'Activity not found.' });
      }

      res.status(200).json({ updatedActivity });
    } catch (error) {
      res.status(500).json({ message: `Error updating activity item: ${error.message}` });
    }
  }

  // Update a timeline
  static async deleteActivityItem(req, res) {
    try {
      const { projectId, itemId } = req.params;
      const updatedActivity = await ActivityRepository.deleteActivityItem(projectId, itemId);

      if (!updatedActivity) {
        return res.status(404).json({ message: 'Activity not found.' });
      }

      res.status(200).json({ updatedActivity });
    } catch (error) {
      res.status(500).json({ message: `Error updating activity item: ${error.message}` });
    }
  }

  // Add images
  static async addItemsToActivity(req, res) {
    const { projectId } = req.params
    let { activities } = req.body;
    try {
      if (activities) activities = await processActivities(activities, projectId)
      const updatedActivity = await ActivityRepository.addItems(projectId, activities);
      return res.status(200).json({ message: 'Images added to Activity successfully', updatedActivity });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

const processActivities = async (activities, projectId) => {
  return Promise.all(activities.map(async (activity) => {
    if (activity.image) {
      const now = Date.now(); // Compute once
      const date = activity.date || now;
      const s3Url = await uploadActivityImage(activity, new Date(date).toISOString(), projectId)
      return {
        image: s3Url,
        date,
        title: activity.title,
        description: activity.description
      };
    } else {
      return activity
    }
  }));
};

const uploadActivityImage = async (activity, key, projectId) => {
  const imageFormat = getImageFormat(activity.image);
  const imagePath = `${ACTIVITY_FOLDER}/${projectId}/${key}.${imageFormat}`;

  return await uploadFile(
    activity.image,
    process.env.BUCKET_NAME,
    imagePath,
    imageFormat
  );
}

export default ActivityController;
