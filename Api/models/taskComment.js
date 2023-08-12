const mongoose = require('mongoose');

const taskCommentSchema = new mongoose.Schema({
  
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    },
    content: {
        type: String,
        required: true,
    },
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admins',
    },
//   parentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Comment', // Self-reference to represent the parent comment
//   },
}, {
  timestamps: true,
});

module.exports = mongoose.model('taskcomment', taskCommentSchema);
