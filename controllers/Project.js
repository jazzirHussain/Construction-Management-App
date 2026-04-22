import ProjectRepository from '../repository/Project.js';

class ProjectController {
  // Find a project by ID and client
  static async getProjectById(req, res) {
    try {
      // The project has already been fetched in the middleware and is available in req.project      
      const project = req.project;

      return res.status(200).json({ project });
    } catch (error) {      
      return res.status(500).json({ message: `Error fetching project: ${error.message}` });
    }
  }

  // Add a new project
  static async addProject(req, res) {
    const { projectData, paymentData, timelineData, galleryData, activityData } = req.body;

    try {
      if (projectData && projectData.startDate) {
        projectData.startDate = new Date(projectData.startDate)
      }

      if (projectData && projectData.endDate) {
        projectData.endDate = new Date(projectData.endDate)
      }

      if (paymentData && paymentData.schedules) {
        paymentData.schedules = paymentData.schedules.map(schedule => ({
          ...schedule,
          startDate: new Date(schedule.startDate),
          endDate: new Date(schedule.endDate),
        }));
      }

      // Convert string dates in timelineData.items to Date objects
      if (timelineData && timelineData.items) {
        timelineData.items = timelineData.items.map(item => ({
          ...item,
          date: new Date(item.date),
        }));
      }

      const project = await ProjectRepository.add(projectData, paymentData, timelineData, galleryData, activityData);
      return res.status(201).json(project);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Delete a project
  static async deleteProject(req, res) {
    const { projectId } = req.params;

    try {
      await ProjectRepository.delete(projectId);
      return res.status(200).json({ message: 'Project and associated records deleted successfully' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Update a project
  static async updateProject(req, res) {
    const { projectId } = req.params;
    const updateData = req.body

    try {
      const updatedProject = await ProjectRepository.update(projectId, updateData);
      return res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Get all projects for a client with pagination
  static async getAllProjects(req, res) {
    const { clientId } = req.user; // Assuming clientId comes from authenticated user

    try {
      const result = req.projects;
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Search projects based on name, client name, or mobile
  static async searchProjects(req, res) {
    const { query } = req.query;
    const { page = 1, limit = 10 } = req.query;

    try {
      const result = await ProjectRepository.search(query, page, limit);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

}

function processProject(project) {
  const { schedules } = project?.payment || {}  
  let totalPaid = 0;
  let totalAmount = 0;
  let isDue = false;
  let counts = { pending: 0, upcoming: 0, paid: 0 };
  const today = Date.now()

  schedules.forEach(({ amount, status, dueDate }) => {
    totalAmount += amount;

    if (status === 'paid') {
      totalPaid += amount;
      counts.paid++;
    } else if (today > new Date(dueDate)) {
      isDue = true;
      counts.pending++;
    } else {
      counts.upcoming++;
    }
  });

  const balanceAmount = totalAmount - totalPaid;
  project.payment = { ...project.payment, isDue, totalPaid, balanceAmount, ...counts }  
  return project
};

export default ProjectController;
