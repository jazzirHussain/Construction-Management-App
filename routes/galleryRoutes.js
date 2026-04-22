import express from 'express';
import GalleryController from '../controllers/Gallery.js';
import { ROLE_ADMIN, ROLE_SUPER } from '../constants.js';
import checkRoles from '../middlewares/checkRoles.js';

const router = express.Router();

// Role-based access protection (except for GET routes)
router.post('/', checkRoles([ROLE_ADMIN]), GalleryController.addGallery);
router.delete('/project/:projectId', checkRoles([ROLE_ADMIN]), GalleryController.deleteGallery);
router.put('/project/:projectId', checkRoles([ROLE_ADMIN]), GalleryController.updateGallery);
router.put('/addImages/project/:projectId', checkRoles([ROLE_ADMIN, ROLE_SUPER]), GalleryController.addImages);

// Public access for retrieving galleries (without role check)
router.get('/project/:projectId', GalleryController.getGalleryByProject);

export default router;
