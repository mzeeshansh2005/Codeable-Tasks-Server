import mongoose from 'mongoose';
const { Schema } = mongoose;
const WorkflowStatusSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    orderIndex: {
      type: Number,
      required: true,
      default: 0,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'statuses',
  }
);
const WorkflowStatus = mongoose.model('WorkflowStatus', WorkflowStatusSchema);
export default WorkflowStatus;
