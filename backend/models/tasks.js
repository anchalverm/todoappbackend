const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  // Add more fields if needed
});

const TaskModel = mongoose.model('Task', taskSchema);

module.exports = TaskModel;
