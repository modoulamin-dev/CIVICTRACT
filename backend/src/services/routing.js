const Department = require("../models/Department");

async function routeByCategory(category) {
  const match = await Department.findOne({
    isActive: true,
    categories: category,
  });
  if (match) return match;

  const desk = await Department.findOne({
    isActive: true,
    name: "General Complaints Desk",
  });
  return desk;
}

module.exports = { routeByCategory };
