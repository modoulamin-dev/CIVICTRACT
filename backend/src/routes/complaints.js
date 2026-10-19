const { body, param, query } = require("express-validator");
const { Router } = require("express");
const {
  createComplaint,
  trackComplaint,
  listPublic,
  publicDetail,
  myComplaints,
} = require("../controllers/complaintController");
const { optionalAuth, requireAuth } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const { validate } = require("../middleware/validate");

const CATEGORIES = ["roads", "waste", "water", "unsafe_spaces", "other"];
const router = Router();

router.post(
  "/",
  optionalAuth,
  upload.single("photo"),
  [
    body("category").isIn(CATEGORIES).withMessage("Choose a valid category."),
    body("description").isLength({ min: 10, max: 2000 }).withMessage("Describe the problem in 10 to 2000 characters."),
    body("region").trim().notEmpty().withMessage("Region is required."),
    body("area").trim().notEmpty().withMessage("Area or town is required."),
    body("email").optional({ values: "falsy" }).isEmail().withMessage("Enter a valid email."),
  ],
  validate,
  createComplaint
);

router.get(
  "/track/:trackingNumber",
  [param("trackingNumber").isLength({ min: 8 }).withMessage("Enter a tracking number.")],
  validate,
  trackComplaint
);

router.get(
  "/public",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
  ],
  validate,
  listPublic
);

router.get("/public/:id", publicDetail);

router.get("/mine", requireAuth, myComplaints);

module.exports = router;
