import mongoose from 'mongoose';
const { Schema } = mongoose;

const ActivitySchema = new Schema(
  {
    user: {
      type: String, // Store Firebase UID as string
      required: true,
      index: true, // Index for faster queries
    },
    type: {
      type: String,
      enum: ['Project', 'Issue'],
      required: true,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'type', // Dynamic reference based on type field
    },
  },
  {
    timestamps: true,
    collection: 'activities',
  }
);

// Compound index for efficient queries
ActivitySchema.index({ user: 1, updatedAt: -1 });
ActivitySchema.index({ user: 1, type: 1, updatedAt: -1 });

// Optional: TTL index to automatically delete old activities after 90 days
// ActivitySchema.index({ updatedAt: 1 }, { expireAfterSeconds: 7776000 });

const Activity = mongoose.model('Activity', ActivitySchema);
export default Activity;
