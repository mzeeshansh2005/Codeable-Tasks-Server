import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);
UserSchema.virtual('teams', {
    ref: 'Team', 
    localField: '_id', 
    foreignField: 'members', 
    justOne: false
});
const User = mongoose.model('User', UserSchema);
export default User;
