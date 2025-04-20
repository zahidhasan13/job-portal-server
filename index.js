const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookie = require("cookie-parser");
const connectDB = require("./utils/connectDB");
const userRoute = require('./routes/userRoute')
const companyRoute = require('./routes/companyRoute')
const jobRoute = require('./routes/jobRoute')
const applicationRoute = require('./routes/applicationRoute')

const app = express();

const port = process.env.PORT || 8484;

// middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  })
);
app.use(cookie());
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

// API's
app.use("/api/user", userRoute)
app.use("/api/company", companyRoute)
app.use("/api/job", jobRoute)
app.use("/api/application", applicationRoute)

app.listen(port, () => {
  connectDB();
  console.log("Server running on port", port);
});
