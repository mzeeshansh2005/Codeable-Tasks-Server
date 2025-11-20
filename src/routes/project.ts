import { Router } from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project';
import { authenticateUser } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateUser);

// GET /api/v1/projects - Get all projects of a specific user
router.get('/:uid', getAllProjects);

// GET /api/v1/projects/:id - Get a specific project by ID
router.get('/:id', getProjectById);

// POST /api/v1/projects - Create a new project
router.post('/', createProject);

// PATCH /api/v1/projects/:id - Update a project
router.patch('/:id', updateProject);

// DELETE /api/v1/projects/:id - Delete a project
router.delete('/:id', deleteProject);

export default router;
