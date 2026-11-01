const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Read JSON data sent in requests
app.use(express.json());

// Define the structure of a student
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  course: { type: String, required: true }
});

// Create the Student model
const Student = mongoose.model("Student", studentSchema);

// Test route
app.get("/", (req, res) => {
  res.send("Student Management API is running!");
});

// Part 2 - Get all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Part 2 - Add a new student
app.post("/students", async (req, res) => {
  try {
    const { name, email, course } = req.body;
    if (!name || !email || !course) {
      return res.status(400).json({
        message: "Please provide name, email and course"
      });
    }
    const newStudent = new Student({ name, email, course });
    const savedStudent = await newStudent.save();
    res.status(201).json({
      message: "Student added successfully",
      student: savedStudent
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Part 3 - Connect to MongoDB, then start the server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((error) => {
    console.log("Database connection failed:", error.message);
  });