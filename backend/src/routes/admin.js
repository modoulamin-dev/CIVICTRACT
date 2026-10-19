const { body } = require("express-validator");
const { Router } = require("express");
const {
  listAdmin,
  adminDetail,
  updateStatus,
  updateUrgent,
  reassign,
  addNote,
  setVisibility,
} = require("../controllers/complaintController");
const { summary, byArea, byCategory, resolutionTime } = require("../controllers/statsController");
const {
  listDepartments,
  createDepartment,
  updateDepartment,
  listUsers,
  createStaff,
  updateUser,
} = require("../controllers/adminController");
const { requireAuth, requireRole } = require("../middleware/auth");
const { validate } = require("../middleware/validate");

const router = Router();
const staff = [requireAuth, requireRole("staff", "super_admin")];
const superAdmin = [requireAuth, requireRole("super_admin")];

router.get("/complaints", ...staff, listAdmin);
router.get("/complaints/:id", ...staff, adminDetail);
router.patch(
  "/complaints/:id/status",
  ...staff,
  [
    body("status").isIn(["received", "assigned", "in_progress", "resolved"]),
    body("message").optional({ values: "falsy" }).isLength({ min: 3 }),
  ],
  validate,
  updateStatus
);
router.patch("/complaints/:id/urgent", ...staff, [body("isUrgent").isBoolean()], validate, updateUrgent);
router.patch("/complaints/:id/reassign", ...staff, [body("departmentId").notEmpty()], validate, reassign);
router.post(
  "/complaints/:id/notes",
  ...staff,
  [body("message").isLength({ min: 3 }).withMessage("Write a short note.")],
  validate,
  addNote
);
router.patch("/complaints/:id/visibility", ...staff, [body("isPublic").isBoolean()], validate, setVisibility);

router.get("/stats/summary", ...staff, summary);
router.get("/stats/by-area", ...staff, byArea);
router.get("/stats/by-category", ...staff, byCategory);
router.get("/stats/resolution-time", ...staff, resolutionTime);

router.get("/departments", ...superAdmin, listDepartments);
router.post("/departments", ...superAdmin, [body("name").trim().notEmpty()], validate, createDepartment);
router.patch("/departments/:id", ...superAdmin, updateDepartment);

router.get("/users", ...superAdmin, listUsers);
router.post(
  "/users",
  ...superAdmin,
  [
    body("name").trim().notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
  ],
  validate,
  createStaff
);
router.patch("/users/:id", ...superAdmin, updateUser);

module.exports = router;
