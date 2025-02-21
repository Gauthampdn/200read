const Article = require("../models/articleModel");
const mongoose = require("mongoose");

// Get today's article
const getTodayArticle = async (req, res) => {
  try {
    console.log('Starting getTodayArticle...');
    
    // Get all articles first to see what we're working with
    const allArticles = await Article.find({}).sort({ dateCreated: -1 });
    console.log('All articles:', allArticles.map(a => ({
      id: a._id,
      name: a.name,
      dateCreated: a.dateCreated
    })));

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