const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    // Option 1: Using service account (recommended for production)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } 
    // Option 2: Using project ID (for development/testing)
    else if (process.env.FIREBASE_PROJECT_ID) {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    } else {
      console.warn('Firebase Admin not initialized. Set FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID in .env');
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

/**
 * Verify Firebase ID token
 * @param {string} token - Firebase ID token
 * @returns {Promise<Object>} Decoded token
 */
async function verifyToken(token) {
  try {
    // Remove 'Bearer ' prefix if present
    const idToken = token.replace(/^Bearer\s+/i, '');
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Extract token from request headers
 * @param {Object} req - Express request object
 * @returns {string|null} Token or null
 */
function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }
  return authHeader;
}

module.exports = {
  admin,
  verifyToken,
  getTokenFromRequest,
};
