const mongoose = require('mongoose');
const { Schema } = mongoose;

const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  videos: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Video'
    }
  ],
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel'
  }
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
