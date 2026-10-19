const { body } = require("express-validator");
const { Router } = require("express");
const { register, login, me } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");

const router = Router();

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name is required."),
    body("email").isEmail().withMessage("Enter a valid email."),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
    body("phone").optional({ values: "falsy" }).isString(),
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  validate,
  login
);

router.get("/me", requireAuth, me);

module.exports = router;
