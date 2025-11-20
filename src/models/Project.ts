import mongoose from 'mongoose';
const { Schema } = mongoose;

const ProjectSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    description: {
      type: String,
    },
    members: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'projects',
  }
);
const Project = mongoose.model('Project', ProjectSchema);
export default Project;
