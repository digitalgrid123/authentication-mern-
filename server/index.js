const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // cross sharing in the frontend
const EmployeeModel = require("./model/employee");
const UserModel = require("./model/user");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/employee", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.get("/getUser", (req, res) => {
  UserModel.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(500).json(err));
});

app.post("/register", (req, res) => {
  const { email, password, name } = req.body;

  // Check for required fields
  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ error: "Email, password, and name are required" });
  }

  // Check if the email is already in use
  EmployeeModel.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        // If the email is already in use, return a 409 Conflict status code
        return res.status(409).json({ error: "Email is already in use" });
      }

      // If the email is not in use, create a new employee record
      EmployeeModel.create({ email, password, name })
        .then((employee) => res.status(201).json(employee)) // Status 201 for resource creation
        .catch((err) => {
          // Handle validation errors and other errors
          if (err.name === "ValidationError") {
            res.status(400).json({ error: err.message });
          } else {
            res
              .status(500)
              .json({ error: "An error occurred while creating the employee" });
          }
        });
    })
    .catch((err) =>
      res
        .status(500)
        .json({ error: "An error occurred while checking the email" })
    );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  EmployeeModel.findOne({ email })
    .then((user) => {
      if (!user) {
        // If the user is not found, send a 404 status code with an error message
        res.status(404).json({ error: "User Not Found" });
      } else if (user.password !== password) {
        // If the password is incorrect, send a 401 status code with an error message
        res.status(401).json({ error: "Wrong Password" });
      } else {
        // If the login is successful, send a 200 status code with a success message
        res.status(200).json({ message: "Success" });
      }
    })
    .catch((err) => {
      // If there's an error in the find operation, send a 500 status code with the error message
      res.status(500).json({ error: err.message });
    });
});

app.listen(5000, () => {
  console.log("server started");
});
