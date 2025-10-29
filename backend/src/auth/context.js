const { verifyToken, getTokenFromRequest } = require('./firebaseAdmin');

/**
 * Create GraphQL context with authenticated user
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} GraphQL context
 */
async function createContext({ req }) {
  try {
    const token = getTokenFromRequest(req);
    
    if (!token) {
      return { user: null, isAuthenticated: false };
    }

    const decodedToken = await verifyToken(token);
    
    return {
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
      },
      isAuthenticated: true,
    };
  } catch (error) {
    return { user: null, isAuthenticated: false };
  }
}

module.exports = { createContext };
