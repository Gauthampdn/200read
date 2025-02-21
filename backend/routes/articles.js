const express = require("express");
const {
  getTodayArticle,
  getPastWeekArticles,
  likeArticle
} = require("../controllers/articleController");
const Article = require("../models/articleModel");

const router = express.Router();

// Public routes
router.get("/today", getTodayArticle);

// Protected routes (will add auth middleware later)
router.get("/past-week", getPastWeekArticles);
router.post("/:id/like", likeArticle);

// Test route to create a sample article
router.post("/test", async (req, res) => {
  try {
    const testArticle = new Article({
      name: "Test Article",
      description: "This is a test article",
      image: "https://example.com/test.jpg",
      text: "Test article content...",
      dateCreated: new Date()
    });

    const savedArticle = await testArticle.save();
    console.log("Created test article:", savedArticle);
    res.status(201).json(savedArticle);
  } catch (error) {
    console.error("Error creating test article:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 