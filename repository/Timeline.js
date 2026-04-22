import Timeline from '../models/Timeline.js';

class TimelineRepository {
  // Add new timeline
  static async addTimeline(timelineData) {
    try {
      const {project} = timelineData
      const existingTimeline = await Timeline.findOne({ project: project });
      if (existingTimeline) {
        throw new Error('Timeline for this project already exists.');
      }
      const timeline = new Timeline(timelineData);
      return await timeline.save();
    } catch (error) {
      throw new Error(`Error adding timeline: ${error.message}`);
    }
  }

  // Get timeline by project ID
  static async getTimelineByProjectId(projectId) {
    try {
      const timeline = await Timeline.findOne({ project: projectId })
      if (timeline && timeline.items) {
        // Sort the items array by date in ascending order
        timeline.items.sort((a, b) => new Date(a.date) - new Date(b.date));
      }

      return timeline

    } catch (error) {
      throw new Error(`Error retrieving timeline: ${error.message}`);
    }
  }

  static async updateTimelineItem(projectId, itemId, timelineData) {
    try {
      const updateFields = {};
      for (const key in timelineData) {
        if (timelineData[key] !== undefined) {
          updateFields[`items.$.${key}`] = timelineData[key];
        }
      }
      const updateQuery = { $set: updateFields }
      return await this.update({ project: projectId, "items._id": itemId }, updateQuery)
    } catch (err) {
      throw new Error(err.message);
    }
  }

  // Update timeline by ID
  static async updateTimeline(projectId, updateData) {
    try {
      return await this.update({project: projectId}, updateData);
    } catch (error) {
      throw new Error(`Error updating timeline: ${error.message}`);
    }
  }

  static async update(query, updateData) {
    try {
      const updatedTimeline = await Timeline.findOneAndUpdate(
        query,
        updateData,
        { new: true, runValidators: true }
      ).lean();

      if (updatedTimeline) {
        updatedTimeline.items.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
      return updatedTimeline;
    } catch (err) {
      throw new Error('Error updating timeline: ' + err.message);
    }
  }

  // Delete timeline by ID
  static async deleteTimeline(projectId) {
    try {
      return await Timeline.findOneAndDelete({ project: projectId });
    } catch (error) {
      throw new Error(`Error deleting timeline: ${error.message}`);
    }
  }

  static async addItemToTimeline(projectId, newItems) {
    try {
      const timeline = await Timeline.findOne({ project: projectId });
      if (!timeline) {
        throw new Error('Timeline not found for the given project.');
      }

      timeline.items.push(...newItems); // Append new images
      await timeline.save();

      return timeline;
    } catch (error) {
      throw new Error(`Error updating timeline: ${error.message}`);
    }
  }
}

export default TimelineRepository;
