const clerk = require('@clerk/clerk-sdk-node');
const Subscription = require('../models/subscriptionModel');

const handleStripeWebhook = async (req, res) => {
  try {
    const event = req.body;
    
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        // Get subscription details from event
        const subscription = await Subscription.findOne({
          stripeSubscriptionId: event.data.object.id
        });
        
        if (subscription) {
          // Update user metadata in Clerk
          await clerk.users.updateUser(subscription.userId, {
            publicMetadata: {
              isPro: true
            }
          });
          
          console.log(`Updated user ${subscription.userId} to pro status`);
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = await Subscription.findOne({
          stripeSubscriptionId: event.data.object.id
        });
        
        if (subscription) {
          // Remove pro status from user
          await clerk.users.updateUser(subscription.userId, {
            publicMetadata: {
              isPro: false
            }
          });
          
          console.log(`Removed pro status from user ${subscription.userId}`);
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  handleStripeWebhook
}; 