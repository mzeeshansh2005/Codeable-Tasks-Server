import mongoose from 'mongoose';
const { Schema } = mongoose;
const IssueSchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    workflowStatus: {
      type: Schema.Types.ObjectId,
      ref: 'WorkflowStatus',
      required: true,
      default: 'workflow_statuses.0',
    },
    reporter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ['Task', 'Bug', 'Story', 'Epic'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['Highest', 'High', 'Medium', 'Low', 'Lowest'],
      default: 'Medium',
    },
    estimate: {
      type: Number,
    },
    attachments: {
      type: [String],
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: 'Comment',
    },
  },
  {
    timestamps: true,
    collection: 'issues',
  }
);
const Issue = mongoose.model('Issue', IssueSchema);
export default Issue;
