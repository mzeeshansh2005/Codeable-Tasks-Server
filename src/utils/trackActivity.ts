import Activity from '../models/Activity';
import { Types } from 'mongoose';

interface TrackActivityParams {
  userId: string; // Firebase UID
  type: 'Project' | 'Issue'; // Changed from resourceType to type
  resourceId: string | Types.ObjectId;
}

/**
 * Track user activity for recents functionality
 * Creates a new activity or updates existing one with new timestamp
 */
export const trackActivity = async ({
  userId,
  type,
  resourceId,
}: TrackActivityParams): Promise<void> => {
  try {
    // Use findOneAndUpdate with upsert to either create new or update existing
    await Activity.findOneAndUpdate(
      {
        user: userId,
        type,
        resourceId,
      },
      {
        user: userId,
        type,
        resourceId,
        updatedAt: new Date(), // Update timestamp
      },
      {
        upsert: true, // Create if doesn't exist
        new: true,
      }
    );
  } catch (error) {
    // Log error but don't throw - activity tracking shouldn't break the main flow
    console.error('Error tracking activity:', error);
  }
};

/**
 * Bulk delete activities for a resource (useful when resource is deleted)
 */
export const deleteResourceActivities = async (
  type: 'Project' | 'Issue',
  resourceId: string | Types.ObjectId
): Promise<void> => {
  try {
    await Activity.deleteMany({
      type,
      resourceId,
    });
  } catch (error) {
    console.error('Error deleting resource activities:', error);
  }
};

