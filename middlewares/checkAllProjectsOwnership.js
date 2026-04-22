import { ROLE_ADMIN, ROLE_CLIENT, ROLE_SUPER } from '../constants.js';
import Project from '../models/Project.js'; // Assuming this is your project model
import ProjectRepository from '../repository/Project.js';

export const checkAllProjectsOwnership = async (req, res, next) => {
  const userId = req.user._id;
  const userRole = req.user.role;
  const { page = 1, limit = 10 } = req.query;
  let projection = {}
  let query = {};
  try {

    // Admin gets all projects
    if (userRole === ROLE_ADMIN) {
      query = {};
    }
    // Clients can only see their own projects
    else if (userRole === ROLE_CLIENT) {
      query = { client: userId };
    }
    // Supervisors can see projects they supervise
    else if (userRole === ROLE_SUPER) {
      query = { supervisor: userId };
      projection = { payment: 0, timeline: 0 };
    }

    // Fetch and attach the filtered projects to the request
    let filters = { query, projection }
    const projects = await ProjectRepository.findAllByQuery(filters, page, limit)
    req.projects = projects;

    return next(); // Proceed to controller
  } catch (error) {
    return res.status(500).json({ message: `Error checking access for projects: ${error.message}` });
  }
};
