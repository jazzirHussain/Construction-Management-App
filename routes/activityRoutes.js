import { Router } from 'express';
import ActivityController from '../controllers/Activities.js';
import checkRoles from '../middlewares/checkRoles.js';
import { ROLE_ADMIN, ROLE_SUPER } from '../constants.js';

const router = Router();

// Add a new timeline for a project
router.post('/', checkRoles([ROLE_ADMIN]), ActivityController.add);

// Get a timeline by project ID
router.get('/project/:projectId', ActivityController.getActivityByProject);

// Update a timeline by project ID
router.put('/project/:projectId',checkRoles([ROLE_ADMIN]), ActivityController.updateActivity);

// Delete a timeline by project ID
router.delete('/project/:projectId',checkRoles([ROLE_ADMIN]), ActivityController.deleteActivity);

// Delete a timeline by project ID
router.delete('/removeItem/project/:projectId/item/:itemId',checkRoles([ROLE_ADMIN, ROLE_SUPER]), ActivityController.deleteActivityItem);

router.put('/addItems/project/:projectId',checkRoles([ROLE_ADMIN, ROLE_SUPER]), ActivityController.addItemsToActivity);

router.put('/project/:projectId/item/:itemId',checkRoles([ROLE_ADMIN, ROLE_SUPER]), ActivityController.updateActivityItem);

export default router;
