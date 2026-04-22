import { Router } from 'express';
import TimelineController from '../controllers/Timeline.js';
import checkRoles from '../middlewares/checkRoles.js';
import { ROLE_ADMIN } from '../constants.js';

const router = Router();

// Add a new timeline for a project
router.post('/', checkRoles([ROLE_ADMIN]), TimelineController.addTimeline);

// Get a timeline by project ID
router.get('/project/:projectId', TimelineController.getTimelineByProjectId);

// Update a timeline by project ID
router.put('/project/:projectId',checkRoles([ROLE_ADMIN]), TimelineController.updateTimeline);

// Delete a timeline by project ID
router.delete('/project/:projectId',checkRoles([ROLE_ADMIN]), TimelineController.deleteTimeline);

router.put('/addItems/project/:projectId',checkRoles([ROLE_ADMIN]), TimelineController.addItemToTimeline);

router.put('/project/:projectId/item/:itemId',checkRoles([ROLE_ADMIN]), TimelineController.updateTimelineItem);

export default router;
