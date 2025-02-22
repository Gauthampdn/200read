require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { clerkMiddleware } = require('@clerk/express');


// Import routes
const articleRoutes = require("./routes/articles");
const subscriptionRoutes = require("./routes/subscriptions");

// express app
const app = express();

// middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:8081', 'your-production-domain.com', 'http://localhost:3000'],
  credentials: true
}));

// logging middleware
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.use(clerkMiddleware(), (req, res, next) => {
  console.log("Clerk middleware");
  next();
})


// routes
app.use("/api/articles", articleRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Successfully connected to MongoDB.");
    
    // // Properly await the collections list
    // const collections = await mongoose.connection.db.listCollections().toArray();
    // console.log("Database contains these collections:", collections);
    
    // // Let's also check if our Articles collection exists and has documents
    // const articlesCount = await mongoose.connection.db.collection('articles').countDocuments();
    // console.log("Number of articles in database:", articlesCount);
    
    app.listen(process.env.PORT, () => {
      console.log("Connected to DB and listening on port " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  }); 