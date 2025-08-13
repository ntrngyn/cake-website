// src/utils/imageUtils.ts

/**
 * Chuyển đổi tên loại bánh từ CSDL thành tên thư mục chứa ảnh.
 * @param categoryName - Tên loại bánh (ví dụ: "Bánh Kem").
 * @returns Tên thư mục tương ứng (ví dụ: "Cakes").
 */
export const getCategoryFolder = (categoryName?: string): string => {
  if (!categoryName) {
    return 'default'; // Thư mục dự phòng
  }
  
  const mapping: { [key: string]: string } = {
    'bánh kem': 'Cakes',
    'bánh quy': 'Cookies',
    'bánh ngọt': 'Pastries',
    'bánh nướng': 'Pies',
    // Thêm các loại bánh khác của bạn ở đây
  };

  const lowerCaseName = categoryName.toLowerCase();
  return mapping[lowerCaseName] || 'default';
};