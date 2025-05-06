const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  video: {
    type: Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel',
    required: true
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Channel' // who liked the comment
    }
  ],
  dislikes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Channel' // who disliked
    }
  ],
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment' // nested comments
    }
  ],
  postedDate: {
    type: Date,
    default: Date.now
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;