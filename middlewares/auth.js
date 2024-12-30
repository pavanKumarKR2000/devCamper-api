const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

/** protect route */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  console.log(req.cookies);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  /** if token doesnt exist */
  if (!token) {
    return next(new ErrorResponse("Unauthorized", 401));
  }

  try {
    /** verify token */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse("Unauthorized", 401));
  }
});

/** grant access to specific roles */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`User role ${req.user.role} is Unauthorized`, 403)
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
