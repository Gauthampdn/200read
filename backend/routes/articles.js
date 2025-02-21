const express = require("express");
const {
  getTodayArticle,
  getPastWeekArticles,
  likeArticle
} = require("../controllers/articleController");

const router = express.Router();

// Public routes
router.get("/today", getTodayArticle);

// Protected routes (will add auth middleware later)
router.get("/past-week", getPastWeekArticles);
router.post("/:id/like", likeArticle);

module.exports = router; 