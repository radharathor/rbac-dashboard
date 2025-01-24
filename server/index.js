const express = require("express");

const bodyParser = require("body-parser");

const cors = require('cors');

const app = express();




const corsOptions = {
    origin : 'http://localhost:5173',
    optionSuccessStatus:200,
}

app.use(cors(corsOptions));


app.use(bodyParser.json());


// Mock user database
const mongoose = require("mongoose");

// Connect to MongoDB
const mongoURI = "mongodb://localhost:27017/user_management";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));


  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, default: "defaultpassword" }, // Default password
    role: { type: String, default: "Viewer" },
    status: { type: String, default: "Active" },
  });
  
  const User = mongoose.model("User", userSchema);


const fs = require("fs");
const path = require("path");

// Route to export users to a JSON file
// Route to fetch and export users (updated version)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database

    // Define the file path (optional: if you still want to save to a file)
    const filePath = path.join(__dirname, "users.json");

    // Optional: Write users to a JSON file
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    // Respond with metadata and user data
    res.json({
      success: true,
      message: "Users fetched successfully",
      filePath, // Include the file path for reference
      users,    // Include user data
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
});


// Add New User API
app.post("/api/users", async (req, res) => {
  const { name, email, role, status } = req.body;

  if (!name || !email || !role || !status) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const newUser = new User({ name, email, role, status });
    await newUser.save(); // Save to MongoDB
    res.json({ success: true, message: "User added successfully", user: newUser });
  } catch (err) {
    console.error("Error adding user:", err);  // Log the error in detail
    res.status(500).json({ success: false, message: "Error adding user", error: err.message });
  }
});


 

// Edit User API
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, role, status } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, email, role, status },
      { new: true } // Return the updated user
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating user" });
  }
});


// Delete User API
app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
});


// Sign-In API
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password }); // Simple matching (use hashed passwords in real apps)
    if (!user) {
      console.log("Invalid credentials:", email); // Log failed login attempt
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.json({ success: true, message: "Login successful", user });
  } catch (err) {
    console.error("Error logging in:", err); // Log the error
    res.status(500).json({ success: false, message: "Error logging in" });
  }
});



// Sign-Up API
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.json({ success: true, message: "Sign-Up successful", user: newUser });
  } catch (err) {
    if (err.code === 11000) { // Duplicate email error
      res.status(409).json({ success: false, message: "Email already exists" });
    } else {
      res.status(500).json({ success: false, message: "Error signing up" });
    }
  }
});



// Start server
const port = 8080;
app.listen(port, ()=>{
console.log(`Server running on http://localhost:${port}`)
});
