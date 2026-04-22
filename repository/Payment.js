import Payment from '../models/Payment.js';

class PaymentRepository {

  // 1. Find a Payment by projectId
  static async findByProjectId(projectId) {
    try {
      const payment = (await Payment.findOne({ project: projectId }));
      if (payment) {
        // Sort the schedules by startDate before returning the result
        payment.schedules.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      }
      return payment;
    } catch (err) {
      throw new Error('Error fetching payment by projectId: ' + err.message);
    }
  }

  // 2. Add a new Payment (ensures project uniqueness)
  static async addPayment(paymentData) {
    try {
      const existingPayment = await Payment.findOne({ project: paymentData.project }).lean({ virtuals: true });

      if (existingPayment) {
        throw new Error('A payment already exists for this project.');
      }

      const newPayment = new Payment(paymentData);
      return await newPayment.save();
    } catch (err) {
      throw new Error('Error adding payment: ' + err.message);
    }
  }

  // 3. Update an existing Payment by projectId
  static async updatePayment(projectId, paymentData) {
    try {
      return await this.update({ project: projectId }, paymentData)
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async updatePaymentSchedule(projectId, scheduleId, scheduleData) {
    try {
      const updateFields = {};
      for (const key in scheduleData) {
        if (scheduleData[key] !== undefined) {
          updateFields[`schedules.$.${key}`] = scheduleData[key];
          if(key === 'status' && scheduleData[key] === "paid") updateFields[`schedules.$.paidDate`] = Date.now()
        }
      }
      const updateQuery = { $set: updateFields }
      return await this.update({ project: projectId, "schedules._id": scheduleId }, updateQuery)
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async update(query, updateData) {
    try {
      const updatedPayment = await Payment.findOneAndUpdate(
        query,
        updateData,
        { new: true, runValidators: true }
      );

      if (updatedPayment) {
        // Sort the schedules by startDate before returning the updated result
        updatedPayment.schedules.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      }
      return updatedPayment;
    } catch (err) {
      throw new Error('Error updating payment: ' + err.message);
    }
  }

  // 4. Delete a Payment by projectId
  static async deletePayment(projectId) {
    try {
      const deletedPayment = await Payment.findOneAndDelete({ project: projectId });
      return deletedPayment;
    } catch (err) {
      throw new Error('Error deleting payment: ' + err.message);
    }
  }

  static async deleteSchedule(projectId, scheduleId) {
    try {
      const result = await this.update(
        { project: projectId },
        { $pull: { schedules: { _id: scheduleId } } },
        { new: true } // Return the updated document
      );

      if (!result) {
        throw new Error('Schedule not found');
      }      

      return { message: 'Schedule deleted successfully', updatedSchedule: result };
    } catch (error) {
      throw new Error(`Error deleting schedule: ${error.message}`);
    }
  }

  // 5. Get a specific Payment by paymentId
  static async findPaymentById(paymentId) {
    try {
      const payment = await Payment.findById(paymentId);
      if (payment) {
        // Sort schedules by startDate before returning the result
        payment.schedules.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      }
      return payment;
    } catch (err) {
      throw new Error('Error fetching payment by paymentId: ' + err.message);
    }
  }

  // add schedules for a given project
  static async addSchedules(projectId, newSchedules) {
    try {
      const payment = await Payment.findOne({ project: projectId });
      if (!payment) {
        throw new Error('Payment record not found for the given project.');
      }

      payment.schedules.push(...newSchedules); // Append new Schedules
      await payment.save();

      return payment;
    } catch (error) {
      throw new Error(`Error adding schedules to payment: ${error.message}`);
    }
  }
}

export default PaymentRepository;
