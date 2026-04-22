import { ROLE_SUPER } from '../constants.js';
import ProjectRepository from '../repository/Project.js';
import { hasAccessToProject } from '../utils/CheckAccess.js';

export const checkSingleProjectOwnership = async (req, res, next) => {
  const { projectId } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;

  try {
    const project = (await ProjectRepository.findById(projectId)).toObject();
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (!hasAccessToProject(project, userId, userRole)) {
      return res.status(403).json({ message: 'You are not authorized to access this project.' });
    }

    if(userRole === ROLE_SUPER){
      delete project.payment
      delete project.timeline
    }

    req.project = project; // Attach the project to request object
    return next(); // Pass control to the next middleware/controller
  } catch (error) {
    return res.status(500).json({ message: `Error checking project ownership: ${error.message}` });
  }
};
