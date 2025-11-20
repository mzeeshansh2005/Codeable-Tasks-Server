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
      default: 'todo',
    },
    reporter: {
      type: [String],
      required: true,
    },
    assignees: {
      type: [String],
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
      type: [String],
      enum: ['highest', 'high', 'medium', 'low', 'lowest'],
      default: ['medium'],
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
