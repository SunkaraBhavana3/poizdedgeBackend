// middleware/authMiddleware.js
export const verifyAdmin = (req, res, next) => {
  const adminEmail = "bhavanasunkara5@gmail.com";

  if (!req.user || req.user.email !== adminEmail) {
    return res.status(403).json({ message: "Access denied: Admin only" });
  }
  next();
};
