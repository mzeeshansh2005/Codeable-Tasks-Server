import { Request, Response } from 'express';
import Project from '../models/Project';
import { trackActivity } from '../utils/trackActivity';

/**
 * Get all projects for the authenticated user
 */
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;

    const projects = await Project.find({ members: userId })
      .populate('members', 'name email avatar')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Projects fetched successfully',
      data: projects,
    });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message,
    });
  }
};

/**
 * Get a single project by ID
 * This will track the activity as a "view"
 */
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid;

    const project = await Project.findById(id).populate(
      'members',
      'name email avatar'
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Track that user viewed this project (for recents)
    if (userId) {
      await trackActivity({
        userId,
        type: 'Project',
        resourceId: id,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project fetched successfully',
      data: project,
    });
  } catch (error: any) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message,
    });
  }
};

/**
 * Create a new project
 * This will track the activity as a "create"
 */
export const createProject = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    const { title, description, img, members } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    const project = await Project.create({
      id: new Date().getTime(), // You might want to use a better ID generation
      title,
      description,
      img,
      members: members || [userId], // Creator is automatically a member
    });

    // Track that user created this project
    if (userId) {
      await trackActivity({
        userId,
        type: 'Project',
        resourceId: project._id,
      });
    }

    const populatedProject = await Project.findById(project._id).populate(
      'members',
      'name email avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: populatedProject,
    });
  } catch (error: any) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message,
    });
  }
};

/**
 * Update a project
 * This will track the activity as an "update"
 */
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid;
    const updates = req.body;

    const project = await Project.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('members', 'name email avatar');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Track that user updated this project
    if (userId) {
      await trackActivity({
        userId,
        type: 'Project',
        resourceId: id,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error: any) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: error.message,
    });
  }
};

/**
 * Delete a project
 * This will clean up all related activities
 */
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { deleteResourceActivities } = await import(
      '../utils/trackActivity'
    );

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Clean up all activities related to this project
    await deleteResourceActivities('Project', id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message,
    });
  }
};

