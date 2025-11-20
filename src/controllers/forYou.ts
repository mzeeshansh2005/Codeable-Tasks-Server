import { Request, Response } from 'express';
import Activity from '../models/Activity';
import Project from '../models/Project';
import Issue from '../models/Issue';

export const getForYouRecents = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const { limit } = req.query;
    const limitNumber = parseInt((limit as string) || '5');
    const userId = req.user?.uid;
    let query: any = { user: userId };

    // Filter by resource type
    if (type === 'projects') {
      query.type = 'Project';
    } else if (type === 'all') {
      // No filter - get all types
      query.type = { $in: ['Project', 'Issue'] };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Use "projects" or "all"',
      });
    }

    // Get top 5 most recent activities
    const activities = await Activity.find(query)
      .sort({ updatedAt: -1 })
      .limit(limitNumber)
      .lean();

    // Populate the actual resources
    const recents = await Promise.all(
      activities.map(async (activity) => {
        let resource = null;

        if (activity.type === 'Project') {
          resource = await Project.findById(activity.resourceId)
            .populate('title')
            .lean();
        } else if (activity.type === 'Issue') {
          resource = await Issue.findById(activity.resourceId)
            .populate('title')
            .lean();
        }

        return {
          type: activity.type,
          title: resource?.title,
          lastAccessed: activity.updatedAt,
        };
      })
    );

    // Filter out any null resources (in case they were deleted)
    const validRecents = recents.filter((r) => r.title !== null);

    res.status(200).json({
      success: true,
      message: 'Recents fetched successfully',
      data: validRecents,
    });
  } catch (error: any) {
    console.error('Error fetching recents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recents',
      error: error.message,
    });
  }
};
