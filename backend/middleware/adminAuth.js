// Admin authentication middleware
export default function adminAuth(req, res, next) {
  // In production, replace this with JWT/session role check
  const role = req.headers['x-user-role'];
  if (role === 'admin' || role === 'administrator') {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden: Admins only.' });
} 