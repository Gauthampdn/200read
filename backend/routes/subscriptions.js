const express = require('express');
const {
  createSubscription,
  cancelSubscription,
  handleWebhook
} = require('../controllers/subscriptionController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Webhook doesn't need auth
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.use(requireAuth);
router.post('/create', createSubscription);
router.post('/cancel', cancelSubscription);

module.exports = router; 