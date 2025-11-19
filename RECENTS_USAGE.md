# Recents System Usage Guide

## Overview

The recents system tracks user activities (viewing, creating, updating) on resources like Projects and Issues. It uses a separate `Activity` model for scalability and performance.

## Architecture

### Activity Model
Located at: `src/models/Activity.ts`

**Fields:**
- `user`: Reference to the User who performed the action
- `resourceType`: Type of resource ('Project', 'Issue', 'Team')
- `resourceId`: ID of the resource (dynamic reference)
- `actionType`: Type of action ('view', 'create', 'update', 'delete')
- `timestamps`: Automatic createdAt and updatedAt fields

**Indexes:**
- Compound index on `user` + `updatedAt` for fast recent queries
- Compound index on `user` + `resourceType` + `updatedAt` for filtered queries

## API Endpoints

### Get Recent Items

**Endpoint:** `GET /api/v1/for-you/get-recents/:type`

**Parameters:**
- `type`: 
  - `"projects"` - Returns only recent projects
  - `"all"` - Returns all recent items (projects and issues)

**Headers:**
```
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Recents fetched successfully",
  "data": [
    {
      "resourceType": "Project",
      "resource": {
        "_id": "...",
        "title": "My Project",
        "description": "...",
        "members": [...]
      },
      "lastAccessed": "2025-11-19T10:30:00.000Z",
      "actionType": "view"
    },
    {
      "resourceType": "Issue",
      "resource": {
        "_id": "...",
        "title": "Bug Fix",
        "type": "Bug",
        "assignee": {...},
        "project": {...}
      },
      "lastAccessed": "2025-11-19T09:15:00.000Z",
      "actionType": "update"
    }
  ]
}
```

## Usage in Controllers

### Tracking User Activities

Import the tracking utility:

```typescript
import { trackActivity } from '../utils/trackActivity';
```

### Example: Track when user views a project

```typescript
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const project = await Project.findById(id)
      .populate('members', 'name email avatar');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Track that user viewed this project
    await trackActivity({
      userId,
      resourceType: 'Project',
      resourceId: id,
      actionType: 'view',
    });

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
    });
  }
};
```

### Example: Track when user creates an issue

```typescript
export const createIssue = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const issueData = req.body;

    const issue = await Issue.create({
      ...issueData,
      reporter: userId,
    });

    // Track that user created this issue
    await trackActivity({
      userId,
      resourceType: 'Issue',
      resourceId: issue._id,
      actionType: 'create',
    });

    res.status(201).json({
      success: true,
      message: 'Issue created successfully',
      data: issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating issue',
    });
  }
};
```

### Example: Clean up activities when resource is deleted

```typescript
import { deleteResourceActivities } from '../utils/trackActivity';

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Project.findByIdAndDelete(id);

    // Clean up all activities related to this project
    await deleteResourceActivities('Project', id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
    });
  }
};
```

## When to Track Activities

### ✅ DO Track:
- **View actions**: When user opens/views a resource
- **Create actions**: When user creates a new resource
- **Update actions**: When user edits a resource
- **Delete actions**: Optional, but can be useful for analytics

### ❌ DON'T Track:
- List/search operations (too many activities)
- Automated system actions
- Background jobs

## Best Practices

1. **Always use try-catch**: Activity tracking shouldn't break main functionality
2. **Track at the end**: Track activity after successful operation
3. **Use appropriate action types**: Be consistent with 'view', 'create', 'update', 'delete'
4. **Clean up on delete**: Remove activities when resources are deleted
5. **Consider TTL**: Uncomment the TTL index in Activity model if you want auto-cleanup

## Optional: Enable Auto-Cleanup (TTL)

In `src/models/Activity.ts`, uncomment this line to auto-delete activities older than 90 days:

```typescript
ActivitySchema.index({ updatedAt: 1 }, { expireAfterSeconds: 7776000 });
```

Adjust `expireAfterSeconds` as needed:
- 30 days: 2592000
- 60 days: 5184000
- 90 days: 7776000

## Testing

### Manual Test with curl

1. **Create some activities** (view a project):
```bash
# You'll need to add this in your project controller first
curl -X GET http://localhost:3000/api/v1/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

2. **Get recent projects**:
```bash
curl -X GET http://localhost:3000/api/v1/for-you/get-recents/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

3. **Get all recents**:
```bash
curl -X GET http://localhost:3000/api/v1/for-you/get-recents/all \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Performance Considerations

- Activities are indexed for fast queries
- Limits results to 5 items to keep response lightweight
- Uses `.lean()` for faster queries (returns plain JavaScript objects)
- Filters out deleted resources automatically
- Activity tracking is non-blocking (won't slow down main operations)

## Future Enhancements

Consider adding:
1. Pagination for more than 5 items
2. Date range filters
3. Activity analytics dashboard
4. Real-time activity feeds
5. Activity sharing/collaboration features

