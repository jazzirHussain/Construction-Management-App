import PaymentRepository from '../repository/Payment.js';

class PaymentController {

  // 1. Get Payment by Project ID
  async getPaymentByProjectId(req, res) {
    try {
      const { projectId } = req.params;
      const payment = await PaymentRepository.findByProjectId(projectId);

      if (!payment) {
        return res.status(404).json({ message: 'Payment not found for the given project.' });
      }

      return res.status(200).json(payment);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // 2. Add a new Payment
  async addPayment(req, res) {
    try {
      const paymentData = req.body;
      const newPayment = await PaymentRepository.addPayment(paymentData);

      return res.status(201).json(newPayment);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  // 3. Update Payment by Project ID
  async updatePayment(req, res) {
    try {
      const { projectId } = req.params;
      const paymentData = req.body;

      const updatedPayment = await PaymentRepository.updatePayment(projectId, paymentData);

      if (!updatedPayment) {
        return res.status(404).json({ message: 'Payment not found for the given project.' });
      }

      return res.status(200).json(updatedPayment);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  // 4. Delete Payment by Project ID
  async deletePayment(req, res) {
    try {
      const { projectId } = req.params;

      const deletedPayment = await PaymentRepository.deletePayment(projectId);

      if (!deletedPayment) {
        return res.status(404).json({ message: 'Payment not found for the given project.' });
      }

      return res.status(200).json({ message: 'Payment deleted successfully.' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // 5. Get Payment by Payment ID
  async getPaymentById(req, res) {
    try {
      const { paymentId } = req.params;

      const payment = await PaymentRepository.findPaymentById(paymentId);

      if (!payment) {
        return res.status(404).json({ message: 'Payment not found.' });
      }

      return res.status(200).json(payment);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Add schedules
  async addSchedules(req, res) {
    const { projectId } = req.params
    const { schedules } = req.body;
    try {
      const updatedPayment = await PaymentRepository.addSchedules(projectId, schedules);
      return res.status(200).json({ message: 'Schedules added to payment successfully', updatedPayment });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Delete schedules
  async deleteSchedules(req, res) {
    const { projectId, scheduleId } = req.params
    try {
      const updatedPayment = await PaymentRepository.deleteSchedule(projectId, scheduleId);
      return res.status(200).json({ message: 'Schedules deleted successfully', updatedPayment });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Update schedules
  async updateSchedule(req, res) {
    const { projectId, scheduleId } = req.params
    const schedule = req.body;    
    try {
      const updatedPayment = await PaymentRepository.updatePaymentSchedule(projectId, scheduleId, schedule);
      return res.status(200).json({ message: 'Schedule updated successfully', updatedPayment });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new PaymentController();
