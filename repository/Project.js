import Project from '../models/Project.js'; // Adjust the path to your Project model
import PaymentRepository from './Payment.js';
import TimelineRepository from './Timeline.js';
import GalleryRepository from './Gallery.js';
import User from '../models/User.js';
import ActivityRepository from './Activities.js';

class ProjectRepository {
  // Find a project by ID and client
  static async findById(projectId) {
    try {
      const project = await Project.findById(projectId).populate("payment supervisor gallery timeline activities");
      
      if (!project) {
        throw new Error('Project not found or does not belong to the specified client');
      }
      return project;
    } catch (error) {
      throw new Error(`Error finding project by ID: ${error.message}`);
    }
  }

  // Add a new project
  static async add(projectData, paymentData, timelineData, galleryData, activityData) {
    // Track IDs for rollback
    let projectId, paymentId, timelineId, galleryId, activityId;

    try {
      // Create the Project document
      const project = new Project(projectData);
      await project.save();
      projectId = project._id;

      // Create Payment record
      const payment = await PaymentRepository.addPayment({ ...paymentData, project: projectId });
      paymentId = payment._id;

      // // Create Timeline record
      const timeline = await TimelineRepository.addTimeline({ ...timelineData, project: projectId })
      timelineId = timeline._id;

      // // Create Gallery record
      const gallery = await GalleryRepository.addGallery({ ...galleryData, project: projectId });
      galleryId = gallery._id;

      // // Create Activity record
      const activity = await ActivityRepository.addActivity({ ...activityData, project: projectId });
      activityId = activity._id;

      // Update the Project document with the IDs of associated records
      project.payment = paymentId;
      project.timeline = timelineId;
      project.gallery = galleryId;
      project.activities = activityId;
      await project.save();

      return project;
    } catch (error) {
      // Rollback changes
      if (projectId) ProjectRepository.delete(projectId);

      throw new Error(`Error adding project with associated records: ${error.message}`);
    }
  }

  static async update(projectId, updateData) {
    try {
      // Find the project document to delete
      const project = await Project.findByIdAndUpdate(projectId, updateData);
      if (!project) {
        throw new Error('Project not found.');
      }
      return project
    } catch (error) {
      // Abort the transaction on error
      throw new Error(`Error updating project: ${error.message}`);
    }
  }

  static async delete(projectId) {

    try {
      // Find the project document to delete
      const project = await ProjectRepository.findById(projectId);
      if (!project) {
        throw new Error('Project not found.');
      }

      // Delete Payment record associated with the project
      await PaymentRepository.deletePayment(project._id);

      // Delete Timeline record associated with the project
      await TimelineRepository.deleteTimeline(project._id);

      // Delete Gallery record associated with the project
      await GalleryRepository.deleteGallery(project._id)

      // Delete Gallery record associated with the project
      await ActivityRepository.deleteActivity(project._id)

      // Delete the Project document itself
      await Project.findByIdAndDelete(project._id)

      return { message: 'Project and associated records deleted successfully.' };
    } catch (error) {
      // Abort the transaction on error
      throw new Error(`Error deleting project and associated records: ${error.message}`);
    }
  }


  // Find all projects by client with pagination
  static async findAllByQuery(filters, page = 1, limit = 10, projection) {
    try {
      const projects = await Project.find(filters.query || {})
        .populate("payment supervisor gallery timeline activities")
        .select(filters.projection || {})
        .skip((page - 1) * limit) // Skip the number of documents based on the page number
        .limit(limit) // Limit the number of documents returned
        .exec(); // Execute the query

      const total = await Project.countDocuments(filters.query || {}); // Get the total number of projects for the client

      return {
        projects,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Error finding all projects: ${error.message}`);
    }
  }

  static async search(queryString, page = 1, limit = 10) {
    try {
      // Define regular expression for case-insensitive search
      const regex = new RegExp(queryString, 'i');

      const isMobile = /^\d{10}$/.test(queryString);

      let clientIds = [];
      clientIds = await User.find({
        $or: [{ username: regex }, { mobile: regex }]
      }).distinct('_id');


      // Build the project search query
      const projectQuery = {
        $or: [
          { name: regex },
          { client: { $in: clientIds } },
          { supervisor: { $in: clientIds } }
        ]
      };

      const projects = await Project.find(projectQuery)
        .skip((page - 1) * limit) // Skip the number of documents based on the page number
        .limit(limit) // Limit the number of documents returned
        .exec(); // Execute the query

      const total = await Project.countDocuments(projectQuery);

      return {
        projects,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Error searching projects: ${error.message}`);
    }
  }

}


export default ProjectRepository;
