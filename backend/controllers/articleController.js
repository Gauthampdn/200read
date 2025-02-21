const Article = require("../models/articleModel");
const mongoose = require("mongoose");

// Get today's article
const getTodayArticle = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const article = await Article.findOne({
      dateCreated: {
        $gte: today
      }
    });

    if (!article) {
      return res.status(404).json({ error: "No article for today" });
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get past week's articles (requires auth)
const getPastWeekArticles = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const articles = await Article.find({
      dateCreated: {
        $gte: sevenDaysAgo
      }
    }).sort({ dateCreated: -1 });

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Like an article
const likeArticle = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid article ID" });
  }

  try {
    const article = await Article.findByIdAndUpdate(
      id,
      { $inc: { likeCount: 1 } },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTodayArticle,
  getPastWeekArticles,
  likeArticle
}; 