// src/api/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");

// Middleware xác thực token
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1]; // Lấy token từ 'Bearer <token>'

  if (!token) {
    return res
      .status(401)
      .json({ message: "Không tìm thấy token. Yêu cầu truy cập bị từ chối." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Gắn thông tin user đã giải mã vào request
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token không hợp lệ." });
  }
};

// Middleware phân quyền dựa trên vai trò
// roles là một mảng các vai trò được phép, ví dụ: ['Admin', 'Quản lý']
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Truy cập bị từ chối. Bạn cần có vai trò là: ${roles.join(" hoặc ")}`,
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  authorize,
};
