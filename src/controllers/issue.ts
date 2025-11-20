import { Request, Response } from 'express';
import Issue from '../models/Issue';
import { trackActivity } from '../utils/trackActivity';

/**
 * Get all issues for a project
 */
export const getIssuesByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const issues = await Issue.find({ project: projectId })
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar')
      .populate('workflowStatus')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Issues fetched successfully',
      data: issues,
    });
  } catch (error: any) {
    console.error('Error fetching issues:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching issues',
      error: error.message,
    });
  }
};

/**
 * Get a single issue by ID
 * This will track the activity as a "view"
 */
export const getIssueById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid;

    const issue = await Issue.findById(id)
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar')
      .populate('project', 'title')
      .populate('workflowStatus')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name email avatar' },
      });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    // Track that user viewed this issue (for recents)
    if (userId) {
      await trackActivity({
        userId,
        type: 'Issue',
        resourceId: id,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Issue fetched successfully',
      data: issue,
    });
  } catch (error: any) {
    console.error('Error fetching issue:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching issue',
      error: error.message,
    });
  }
};

/**
 * Create a new issue
 * This will track the activity as a "create"
 */
export const createIssue = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    const {
      project,
      title,
      description,
      type,
      priority,
      assignee,
      workflowStatus,
      estimate,
    } = req.body;

    // Validation
    if (!project || !title || !type) {
      return res.status(400).json({
        success: false,
        message: 'Project, title, and type are required',
      });
    }

    const issue = await Issue.create({
      project,
      title,
      description,
      type,
      priority,
      assignee,
      reporter: userId,
      workflowStatus,
      estimate,
    });

    // Track that user created this issue
    if (userId) {
      await trackActivity({
        userId,
        type: 'Issue',
        resourceId: issue._id,
      });
    }

    const populatedIssue = await Issue.findById(issue._id)
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar')
      .populate('project', 'title')
      .populate('workflowStatus');

    res.status(201).json({
      success: true,
      message: 'Issue created successfully',
      data: populatedIssue,
    });
  } catch (error: any) {
    console.error('Error creating issue:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating issue',
      error: error.message,
    });
  }
};

/**
 * Update an issue
 * This will track the activity as an "update"
 */
export const updateIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid;
    const updates = req.body;

    const issue = await Issue.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar')
      .populate('project', 'title')
      .populate('workflowStatus');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    // Track that user updated this issue
    if (userId) {
      await trackActivity({
        userId,
        type: 'Issue',
        resourceId: id,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Issue updated successfully',
      data: issue,
    });
  } catch (error: any) {
    console.error('Error updating issue:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating issue',
      error: error.message,
    });
  }
};

/**
 * Delete an issue
 * This will clean up all related activities
 */
export const deleteIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { deleteResourceActivities } = await import('../utils/trackActivity');

    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    // Clean up all activities related to this issue
    await deleteResourceActivities('Issue', id);

    res.status(200).json({
      success: true,
      message: 'Issue deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting issue:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting issue',
      error: error.message,
    });
  }
};

/**
 * Get issues assigned to the authenticated user
 */
export const getMyIssues = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;

    const issues = await Issue.find({ assignee: userId })
      .populate('reporter', 'name email avatar')
      .populate('project', 'title')
      .populate('workflowStatus')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Your issues fetched successfully',
      data: issues,
    });
  } catch (error: any) {
    console.error('Error fetching user issues:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your issues',
      error: error.message,
    });
  }
};
