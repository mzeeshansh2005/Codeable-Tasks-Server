import { Router } from 'express';
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
} from '../controllers/team';
import { authenticateUser } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateUser);

// GET /api/v1/teams/:uid - Get all teams of a specific user
router.get('/:uid', getAllTeams);

// GET /api/v1/teams/:id - Get a specific team by ID
router.get('/:id', getTeamById);

// POST /api/v1/teams - Create a new team
router.post('/', createTeam);

// PATCH /api/v1/teams/:id - Update a team
router.patch('/:id', updateTeam);

// DELETE /api/v1/teams/:id - Delete a team
router.delete('/:id', deleteTeam);

export default router;
