import mongoose from 'mongoose';
const { Schema } = mongoose;
const CommentSchema = new Schema(
  {
    issueId: {
      type: Schema.Types.ObjectId,
      ref: 'Issue',
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'comments',
  }
);
const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
