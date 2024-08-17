const express = require('express');  // Importing the Express framework to create the server
const cors = require("cors");  // Importing CORS to handle Cross-Origin Resource Sharing
require('./db/config');  // Importing the database configuration (assumes MongoDB or similar)
const User = require("./db/User");  // Importing the User model/schema from the database
const app = express();  // Initializing the Express application

app.use(express.json());  // Middleware to parse incoming JSON requests
app.use(cors());  // Middleware to enable CORS, allowing cross-origin requests

// POST endpoint to handle user registration
app.post("/register", async (req, resp) => {
    let user = new User(req.body);  // Create a new User instance with the data sent in the request body
    let result = await user.save();  // Save the new user to the database and wait for the operation to complete
    result = result.toObject();
    delete result.password
    resp.send(result);  // Send the result (the saved user data) back to the client
});

// POST endpoint to handle user login
app.post("/login", async (req, resp) => {
    console.log("Request Body:", req.body);

    if (req.body.email && req.body.password) {
        try {
            let user = await User.findOne({ email: req.body.email, password: req.body.password }).select("-password");

            if (user) {
                resp.send(user);
            } else {
                resp.status(401).send({ message: "Invalid Credentials" });
            }
        } catch (error) {
            console.error("Error during login:", error);
            resp.status(500).send({ message: "Internal Server Error" });
        }
    } else {
        console.log("Bad Request: Missing email or password");
        resp.status(400).send({ message: "Invalid Credentials" });
    }
});



app.listen(5000, () => {  // Start the server and have it listen on port 5000
    console.log("Server is running on port 5000");  // Log a message to confirm the server is running
});
