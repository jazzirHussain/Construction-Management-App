import express from 'express';
import ProjectController from '../controllers/Project.js';
import checkRoles from '../middlewares/checkRoles.js';
import { ROLE_ADMIN, ROLE_SUPER } from '../constants.js';
import { checkSingleProjectOwnership } from '../middlewares/checkSingleProjectOwnership.js';
import { checkAllProjectsOwnership } from '../middlewares/checkAllProjectsOwnership.js';

const router = express.Router();

// Search projects by name, client name, or mobile (no role check)
router.get('/search', ProjectController.searchProjects);

// Get project by ID (must belong to client)
router.get('/:projectId', checkSingleProjectOwnership, ProjectController.getProjectById);

// Add a new project (requires admin role)
router.post('/', checkRoles([ROLE_ADMIN]), ProjectController.addProject);

// Delete a project (requires admin role)
router.delete('/:projectId', checkRoles([ROLE_ADMIN]), ProjectController.deleteProject);

// Get all projects for a client (no role check)
router.get('/', checkAllProjectsOwnership, ProjectController.getAllProjects);

router.put('/:projectId', checkRoles([ROLE_ADMIN, ROLE_SUPER]), ProjectController.updateProject);


export default router;
