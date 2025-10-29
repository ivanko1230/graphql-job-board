/**
 * Require authentication middleware for resolvers
 * @param {Function} resolver - GraphQL resolver function
 * @returns {Function} Protected resolver
 */
function requireAuth(resolver) {
  return async (parent, args, context, info) => {
    if (!context.isAuthenticated || !context.user) {
      throw new Error('Authentication required');
    }
    return resolver(parent, args, context, info);
  };
}

module.exports = { requireAuth };
