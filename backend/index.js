const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // Replace with your desired port number

// Set up middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1/admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define your routes and APIs here
const TaskModel = require('./models/tasks.js'); // Adjust the path as needed
app.post('/api/save-data', (req, res) => {
  const requestData = req.body;
  if (!requestData.firstname) {
    return res.status(400).json({ error: 'Please enter a task' });
  }

  // Create a new instance of the TaskModel and save it to the database
  TaskModel.create({
    firstname: requestData.firstname,
    // Add more fields if needed
  })
    .then((createdTask) => {
      res.json({ message: 'Task saved successfully', data: createdTask });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to save task to the database' });
    });
  })
// Add a route to handle the GET request for fetching data
app.get('/api/get-data', (req, res) => {
  // Logic to fetch data from the database or any other data source
  // For example, if using MongoDB with TaskModel:
  TaskModel.find()
    .then((data) => {
      res.json(data); // Send the fetched data as a response
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch data from the database' });
    });
});


// API route to delete a task by its ID
app.delete('/api/delete-task/:taskId', (req, res) => {
  const taskId = req.params.taskId;

  // Use TaskModel.findByIdAndRemove() to delete the task from the database
  TaskModel.findByIdAndRemove(taskId)
    .then((deletedTask) => {
      if (!deletedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ message: 'Task deleted successfully', data: deletedTask });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to delete task from the database' });
    });
});
// API route to update a task by its ID
app.put('/api/update-task/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const updateData = req.body;

  // Use TaskModel.findByIdAndUpdate() to find and update the task in the database
  TaskModel.findByIdAndUpdate(taskId, updateData, { new: true })
    .then((updatedTask) => {
      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ message: 'Task updated successfully', data: updatedTask });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to update task in the database' });
    });
});




// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
