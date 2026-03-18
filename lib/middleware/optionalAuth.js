const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid authorization header' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'admin') req.admin = decoded;
    if (decoded.role === 'user') req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
