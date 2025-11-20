import { Request, Response } from 'express';
import Project from '../models/Project';
import User from '../models/User';
import { trackActivity } from '../utils/trackActivity';

/**
 * Get all projects for the specific user
 */
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    const projects = await Project.find(
      { members: uid },
      'id title img description'
    )
      .sort({ updatedAt: -1 })
      .lean();
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

    const project = await Project.findById(id).lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Manually populate members
    const memberUsers = await User.find(
      { uid: { $in: project.members } },
      'uid name email avatar'
    ).lean();
    const projectWithMembers = { ...project, members: memberUsers };

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
      data: projectWithMembers,
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

    // Manually populate members
    const projectData = await Project.findById(project._id).lean();
    const memberUsers = await User.find(
      { uid: { $in: projectData?.members || [] } },
      'uid name email avatar'
    ).lean();
    const populatedProject = { ...projectData, members: memberUsers };

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
    }).lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Manually populate members
    const memberUsers = await User.find(
      { uid: { $in: project.members } },
      'uid name email avatar'
    ).lean();
    const projectWithMembers = { ...project, members: memberUsers };

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
      data: projectWithMembers,
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
    const { deleteResourceActivities } = await import('../utils/trackActivity');

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
