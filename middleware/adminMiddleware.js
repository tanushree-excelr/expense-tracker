// admin middleware
const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json
        ({ message: 'Access denied' });
    }
    next();
  } catch (error) {
    return res.status(500).json
      ({ message: error.message });
  }
};

module.exports = adminMiddleware;
