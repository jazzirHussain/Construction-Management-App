import TimelineRepository from '../repository/Timeline.js';

class TimelineController {
  // Add a new timeline
  static async addTimeline(req, res) {
    try {
      const timelineData = req.body; // assuming timeline data is sent in the request body
      const newTimeline = await TimelineRepository.addTimeline(timelineData);
      res.status(201).json(newTimeline);
    } catch (error) {
      res.status(500).json({ message: `Error adding timeline: ${error.message}` });
    }
  }

  // Get a timeline by project ID
  static async getTimelineByProjectId(req, res) {
    try {
      const { projectId } = req.params;
      const timeline = await TimelineRepository.getTimelineByProjectId(projectId);

      if (!timeline) {
        return res.status(404).json({ message: 'Timeline not found.' });
      }

      res.status(200).json(timeline);
    } catch (error) {
      res.status(500).json({ message: `Error retrieving timeline: ${error.message}` });
    }
  }

  // Update a timeline
  static async updateTimeline(req, res) {
    try {
      const { projectId } = req.params;
      const updateData = req.body;
      const updatedTimeline = await TimelineRepository.updateTimeline(projectId, updateData);

      if (!updatedTimeline) {
        return res.status(404).json({ message: 'Timeline not found.' });
      }

      res.status(200).json(updatedTimeline);
    } catch (error) {
      res.status(500).json({ message: `Error updating timeline: ${error.message}` });
    }
  }

  // Update a timeline
  static async updateTimelineItem(req, res) {
    try {
      const { projectId, itemId } = req.params;
      const updateData = req.body;
      const updatedTimeline = await TimelineRepository.updateTimelineItem(projectId, itemId, updateData);

      if (!updatedTimeline) {
        return res.status(404).json({ message: 'Timeline not found.' });
      }

      res.status(200).json(updatedTimeline);
    } catch (error) {
      res.status(500).json({ message: `Error updating timeline: ${error.message}` });
    }
  }

  // Delete a timeline by project ID
  static async deleteTimeline(req, res) {
    try {
      const { projectId } = req.params;
      const deletedTimeline = await TimelineRepository.deleteTimeline(projectId);

      if (!deletedTimeline) {
        return res.status(404).json({ message: 'Timeline not found.' });
      }

      res.status(200).json({ message: 'Timeline deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: `Error deleting timeline: ${error.message}` });
    }
  }

  static async addItemToTimeline(req, res) {
    try {
      const { projectId } = req.params;
      const {items} = req.body; 

      // Add item to the timeline
      const updatedTimeline = await TimelineRepository.addItemToTimeline(projectId, items);

      if (!updatedTimeline) {
        return res.status(404).json({ message: 'Timeline not found for this project.' });
      }

      res.status(200).json(updatedTimeline);
    } catch (error) {
      res.status(500).json({ message: `Error adding item to timeline: ${error.message}` });
    }
  }
}

export default TimelineController;
