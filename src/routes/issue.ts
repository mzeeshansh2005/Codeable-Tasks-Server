import { Router } from 'express';
import {
  getIssuesByProject,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
  getMyIssues,
} from '../controllers/issue';
import { authenticateUser } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateUser);

// GET /api/v1/issues/my - Get issues assigned to authenticated user
router.get('/my', getMyIssues);

// GET /api/v1/issues/project/:projectId - Get all issues for a project
router.get('/project/:projectId', getIssuesByProject);

// GET /api/v1/issues/:id - Get a specific issue by ID
router.get('/:id', getIssueById);

// POST /api/v1/issues - Create a new issue
router.post('/', createIssue);

// PATCH /api/v1/issues/:id - Update an issue
router.patch('/:id', updateIssue);

// DELETE /api/v1/issues/:id - Delete an issue
router.delete('/:id', deleteIssue);

export default router;
