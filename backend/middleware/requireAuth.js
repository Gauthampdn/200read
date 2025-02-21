const jwt = require('jsonwebtoken');

const requireAuth = async (req, res, next) => {
  // Get the authorization header
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    // Get the token from the header
    const token = authorization.split(' ')[1];
    
    // Verify the token using Clerk's public key
    // You'll need to fetch this from your Clerk dashboard
    const decoded = jwt.verify(token, process.env.CLERK_PEM_PUBLIC_KEY);
    
    // Add the user ID to the request
    req.user = {
      userId: decoded.sub
    };

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: 'Request is not authorized' });
  }
};

module.exports = requireAuth; 