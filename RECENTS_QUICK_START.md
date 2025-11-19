# Recents System - Quick Start Guide

## TL;DR - How It Works

Instead of storing recents in the User schema, we use a **separate Activity model** that tracks when users interact with resources (Projects, Issues, etc.).

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Your Application                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │    User views/creates/updates         │
        │    a Project or Issue                 │
        └───────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │    trackActivity() is called          │
        │    (non-blocking)                     │
        └───────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │    Activity record saved:              │
        │    {                                   │
        │      user: userId,                     │
        │      resourceType: 'Project',          │
        │      resourceId: projectId,            │
        │      actionType: 'view',               │
        │      updatedAt: now                    │
        │    }                                   │
        └───────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │    When user requests recents:         │
        │    GET /api/v1/for-you/get-recents/all │
        └───────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │    Query Activity model:               │
        │    - Filter by user                    │
        │    - Filter by type (if specified)     │
        │    - Sort by updatedAt DESC            │
        │    - Limit 5                           │
        └───────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │    Populate actual resources           │
        │    (Projects, Issues)                  │
        └───────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │    Return enriched data to user        │
        └───────────────────────────────────────┘
```

## Quick Test

### 1. Start your server
```bash
npm run dev
```

### 2. Create a project (this tracks the activity)
```bash
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "description": "My first project"
  }'
```

### 3. View the project (this also tracks the activity)
```bash
# Replace PROJECT_ID with the ID from step 2
curl -X GET http://localhost:3000/api/v1/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

### 4. Get your recents
```bash
# Get recent projects
curl -X GET http://localhost:3000/api/v1/for-you/get-recents/projects \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"

# Get all recent items (projects + issues)
curl -X GET http://localhost:3000/api/v1/for-you/get-recents/all \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

## Expected Response

```json
{
  "success": true,
  "message": "Recents fetched successfully",
  "data": [
    {
      "resourceType": "Project",
      "resource": {
        "_id": "673c...",
        "title": "Test Project",
        "description": "My first project",
        "members": [
          {
            "_id": "user123",
            "name": "John Doe",
            "email": "john@example.com",
            "avatar": "..."
          }
        ],
        "createdAt": "2025-11-19T10:00:00.000Z",
        "updatedAt": "2025-11-19T10:00:00.000Z"
      },
      "lastAccessed": "2025-11-19T10:05:00.000Z",
      "actionType": "view"
    }
  ]
}
```

## Key Features

✅ **Automatic Tracking**: Activities are tracked automatically in controllers  
✅ **Top 5 Recents**: Returns only the 5 most recent items  
✅ **Filtered by Type**: Supports "projects" or "all" types  
✅ **Rich Data**: Returns full resource data, not just IDs  
✅ **Handles Deletions**: Automatically filters out deleted resources  
✅ **Non-Blocking**: Activity tracking doesn't slow down main operations  
✅ **Indexed**: Fast queries even with millions of activities  
✅ **Auto-Cleanup**: Optional TTL for automatic old data removal  

## Where Activity Tracking Happens

Activity tracking is automatically called in these controllers:

| Controller | Actions That Track |
|------------|-------------------|
| `project.ts` | `getProjectById` (view), `createProject` (create), `updateProject` (update) |
| `issue.ts` | `getIssueById` (view), `createIssue` (create), `updateIssue` (update) |

## Adding Tracking to Your Own Controllers

Just import and call `trackActivity`:

```typescript
import { trackActivity } from '../utils/trackActivity';

// In your controller
await trackActivity({
  userId: req.user._id,
  resourceType: 'Project', // or 'Issue', 'Team'
  resourceId: resourceId,
  actionType: 'view', // or 'create', 'update', 'delete'
});
```

## Database Collections

After using the system, you'll have:

```
users          → Your users
projects       → Your projects
issues         → Your issues/tasks
activities     → NEW! Tracks user interactions ⭐
```

## Performance

- **Indexed queries**: Lightning fast even with millions of activities
- **Limit to 5**: Only returns top 5, keeps responses lightweight
- **Lean queries**: Optimized for performance
- **Non-blocking**: Won't slow down your main operations

## Comparison: User Schema vs Activity Model

| Aspect | User Schema Approach | Activity Model Approach ✅ |
|--------|---------------------|---------------------------|
| Scalability | ❌ Poor (user doc grows) | ✅ Excellent (separate collection) |
| Performance | ❌ Slow (large docs) | ✅ Fast (indexed queries) |
| Flexibility | ❌ Limited | ✅ High (metadata, analytics) |
| Cleanup | ❌ Manual | ✅ Automatic (TTL) |
| Querying | ❌ Complex | ✅ Simple |
| Maintenance | ❌ Difficult | ✅ Easy |

## Files You Care About

### Main Files
- `src/models/Activity.ts` - The activity tracking model
- `src/controllers/forYou.ts` - Returns recents (line 6-81)
- `src/utils/trackActivity.ts` - Helper function to track activities

### Example Files
- `src/controllers/project.ts` - Shows how to integrate tracking
- `src/controllers/issue.ts` - Shows how to integrate tracking

### Documentation
- `RECENTS_IMPLEMENTATION_SUMMARY.md` - Complete implementation details
- `RECENTS_USAGE.md` - Comprehensive usage guide
- `RECENTS_QUICK_START.md` - This file!

## Need Help?

Check the detailed guides:
1. **Implementation details**: See `RECENTS_IMPLEMENTATION_SUMMARY.md`
2. **Usage examples**: See `RECENTS_USAGE.md`
3. **API reference**: See the README.md

## Summary

✨ You now have a **production-ready, scalable recents system** that tracks user activities and returns the top 5 most recent items they've interacted with!

The Activity model approach is the **industry standard** and will scale beautifully as your app grows. 🚀

