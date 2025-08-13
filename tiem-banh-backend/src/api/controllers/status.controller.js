// src/api/controllers/status.controller.js
const statusService = require("../services/status.service.js");

const getAll = async (req, res, next) => {
  try {
    const statuses = await statusService.getAll();
    // Backend của bạn trả về data không có message, nên ta sẽ trả trực tiếp
    res.status(200).json({ data: statuses });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
};
