import { ROLE_ADMIN, ROLE_CLIENT, ROLE_SUPER } from '../constants.js';

export const hasAccessToProject = (project, userId, userRole) => {
  if (userRole === ROLE_ADMIN) {
    return true; // Admin has access to everything
  }

  if (userRole === ROLE_CLIENT && project.client._id.toString() === userId.toString()) {
    return true; // Client owns the project
  }

  if (userRole === ROLE_SUPER && project.supervisor._id.toString() === userId.toString()) {
    return true; // Supervisor is linked to the project
  }

  return false; // No access
};
