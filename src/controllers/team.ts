import { Request, Response } from 'express';
import Team from '../models/Team';

/**
 * Get all teams for the specific user
 */
export const getAllTeams = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    const teams = await Team.find(
      { members: uid },
      'id name img description admin'
    )
      .sort({ updatedAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      message: 'Teams fetched successfully',
      data: teams,
    });
  } catch (error: any) {
    console.error('Error fetching teams:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teams',
      error: error.message,
    });
  }
};

/**
 * Get a single team by ID
 */
export const getTeamById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id).lean();

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team fetched successfully',
      data: team,
    });
  } catch (error: any) {
    console.error('Error fetching team:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching team',
      error: error.message,
    });
  }
};

/**
 * Create a new team
 */
export const createTeam = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    const { name, description, img, members } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Team name is required',
      });
    }

    const team = await Team.create({
      name,
      description,
      img,
      admin: [userId], // Creator is admin
      members: members || [userId], // Creator is automatically a member
      projects: [],
    });

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: team,
    });
  } catch (error: any) {
    console.error('Error creating team:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating team',
      error: error.message,
    });
  }
};

/**
 * Update a team
 */
export const updateTeam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const team = await Team.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team updated successfully',
      data: team,
    });
  } catch (error: any) {
    console.error('Error updating team:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating team',
      error: error.message,
    });
  }
};

/**
 * Delete a team
 */
export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const team = await Team.findByIdAndDelete(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting team:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting team',
      error: error.message,
    });
  }
};
