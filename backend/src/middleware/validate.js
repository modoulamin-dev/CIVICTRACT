const { validationResult } = require("express-validator");

function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = result.array().map((item) => ({
    field: item.path,
    message: item.msg,
  }));
  return res.status(400).json({ message: "Please check the highlighted fields.", errors });
}

module.exports = { validate };
