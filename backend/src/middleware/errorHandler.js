function errorHandler(err, req, res, _next) {
  if (err.name === "MulterError") {
    const message = err.code === "LIMIT_FILE_SIZE" ? "Photo must be 5 MB or smaller." : err.message;
    return res.status(400).json({ message, errors: [{ field: "photo", message }] });
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));
    return res.status(400).json({ message: "Validation failed", errors });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: "That value is already in use.", errors: [] });
  }

  const status = err.status || 500;
  const message = status === 500 ? "Something went wrong. Please try again." : err.message;
  if (status === 500) console.error(err);
  return res.status(status).json({ message, errors: err.errors || [] });
}

module.exports = { errorHandler };
