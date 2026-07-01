const express = require("express");

const router = express.Router();

// Test error route
router.get("/test-error", (req, res, next) => {
  const err = new Error("Test error for error handling");
  err.statusCode = 500;
  next(err);
});

// Route to check if error handler works
router.get("/error-stats", (req, res) => {
  res.json({ message: "Error handler middleware is working" });
});

module.exports = router;
