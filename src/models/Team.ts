import mongoose from 'mongoose';
const { Schema } = mongoose;
const TeamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
    },
    description: {
      type: String,
    },
    admin: {
      type: [String],
      required: true,
    },
    members: {
      type: [String],
      required: true,
    },
    projects: {
      type: [Schema.Types.ObjectId],
      ref: 'Project',
    },
  },
  {
    timestamps: true,
    collection: 'teams',
  }
);
const Team = mongoose.model('Team', TeamSchema);
export default Team;
