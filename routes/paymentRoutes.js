import express from 'express';
import PaymentController from '../controllers/Payment.js';
import chekcRoles from '../middlewares/checkRoles.js'; // Assuming chekcRoles middleware is already implemented
import { ROLE_ADMIN } from '../constants.js';

const router = express.Router();

// Read Payment by Project ID (no role check required)
router.get('/project/:projectId', PaymentController.getPaymentByProjectId);

// Read Payment by Payment ID (no role check required)
router.get('/:paymentId', PaymentController.getPaymentById);

// Add a new Payment (requires ADMIN role)
router.post('/', chekcRoles([ROLE_ADMIN]), PaymentController.addPayment);

// Update Payment by Project ID (requires ADMIN role)
router.put('/project/:projectId', chekcRoles([ROLE_ADMIN]), PaymentController.updatePayment);

// Update schedule by Project ID (requires ADMIN role)
router.put('/project/:projectId/schedule/:scheduleId', chekcRoles([ROLE_ADMIN]), PaymentController.updateSchedule);

// Delete Payment by Project ID (requires ADMIN role)
router.delete('/project/:projectId', chekcRoles([ROLE_ADMIN]), PaymentController.deletePayment);

// Delete Payment by Project ID (requires ADMIN role)
router.delete('/removeSchedule/project/:projectId/schedule/:scheduleId', chekcRoles([ROLE_ADMIN]), PaymentController.deleteSchedules);

// add schedules (requires ADMIN role)
router.put('/addSchedules/project/:projectId', chekcRoles([ROLE_ADMIN]), PaymentController.addSchedules);

export default router;
