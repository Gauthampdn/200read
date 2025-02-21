const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Subscription = require('../models/subscriptionModel');

// Create a subscription
const createSubscription = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    const userId = req.user.userId;

    // Create or get Stripe customer
    let customer = await stripe.customers.create({
      payment_method: paymentMethodId,
      email: req.user.email,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: process.env.STRIPE_PRICE_ID }],
      expand: ['latest_invoice.payment_intent'],
    });

    // Save subscription to database
    const newSubscription = await Subscription.create({
      userId,
      stripeCustomerId: customer.id,
      stripeSubscriptionId: subscription.id,
      status: 'active',
      endDate: new Date(subscription.current_period_end * 1000)
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel subscription
const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user.userId });
    
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Cancel on Stripe
    await stripe.subscriptions.del(subscription.stripeSubscriptionId);

    // Update in database
    subscription.status = 'canceled';
    await subscription.save();

    res.json({ message: 'Subscription canceled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Stripe webhook handler
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.deleted':
      const subscription = await Subscription.findOne({
        stripeSubscriptionId: event.data.object.id
      });
      if (subscription) {
        subscription.status = 'canceled';
        await subscription.save();
      }
      break;
    // Add other webhook events as needed
  }

  res.json({ received: true });
};

module.exports = {
  createSubscription,
  cancelSubscription,
  handleWebhook
}; 