require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const articleRoutes = require("./routes/articles");
const subscriptionRoutes = require("./routes/subscriptions");

// express app
const app = express();

// middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'your-production-domain.com'],
  credentials: true
}));

// logging middleware
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

// routes
app.use("/api/articles", articleRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Connected to DB and listening on port " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  }); 