const Article = require("../models/articleModel");
const mongoose = require("mongoose");
const { clerkClient, getAuth } = require('@clerk/express')


// Get today's article
const getTodayArticle = async (req, res) => {
  try {
    console.log('Starting getTodayArticle...');

    // Find the most recent article
    const article = await Article.findOne()
      .sort({ dateCreated: -1 })  // Sort by date in descending order
      .limit(1);                  // Get only one article

    console.log('Most recent article found:', article);

    if (!article) {
      console.log('No article found');
      return res.status(404).json({ error: "No article found" });
    }

    console.log('Sending article:', {
      id: article._id,
      name: article.name,
      dateCreated: article.dateCreated
    });

    res.status(200).json(article);
  } catch (error) {
    console.error('Error in getTodayArticle:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get past week's articles (requires auth)
const getPastWeekArticles = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Just get the most recent articles, ignoring the year
    const articles = await Article.find()
      .sort({ dateCreated: -1 })
      .limit(7);  // Limit to 7 articles

    console.log("Found articles:", articles.length);
    console.log("Article dates:", articles.map(a => ({
      name: a.name,
      date: a.dateCreated
    })));

    res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
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