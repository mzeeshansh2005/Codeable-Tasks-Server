import mongoose from 'mongoose';
const { Schema } = mongoose;
const TeamSchema = new Schema({
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
    type: [Schema.Types.ObjectId],
    ref: 'User',
    required: true,
  },
  members: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    required: true,
  },
  projects: {
    type: [Schema.Types.ObjectId],
    ref: 'Project',
  },
});
const Team = mongoose.model('Team', TeamSchema);
export default Team;
