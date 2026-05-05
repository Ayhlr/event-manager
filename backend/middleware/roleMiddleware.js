const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const singleRole = req.user?.role;
    const multipleRoles = req.user?.roles || [];

    const userRoles = singleRole
      ? [singleRole, ...multipleRoles]
      : multipleRoles;

    const hasPermission = userRoles.some((role) =>
      allowedRoles.includes(role)
    );

    if (!hasPermission) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};

module.exports = authorizeRoles;