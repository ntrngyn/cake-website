// src/pages/public/ProductsPage.tsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { cakeApi, Cake } from "../../api/cakeApi";
import ProductCard from "../../components/common/ProductCard";
import styles from "./ProductsPage.module.css";

export default function ProductsPage() {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [inputValue, setInputValue] = useState(""); // State cho giá trị của ô input
  const [searchTerm, setSearchTerm] = useState(""); // State chỉ được cập nhật khi nhấn Enter

  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");

  useEffect(() => {
    const fetchCakes = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiParams: any = {
          page: currentPage,
          limit: 9,
          categoryId: categoryId ? Number(categoryId) : undefined,
        };

        if (searchTerm) {
          apiParams.search = searchTerm;
        }

        const response = await cakeApi.getAll(apiParams);
        setCakes(response.data.cakes);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Không thể tải danh sách sản phẩm.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCakes();
  }, [currentPage, searchTerm, categoryId]);

  // Hàm xử lý sự kiện nhấn phím
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Khi nhấn Enter, cập nhật searchTerm để kích hoạt useEffect
      setSearchTerm(inputValue);
      setCurrentPage(1); // Reset về trang 1
    }
  };

  if (loading) return <div>Đang tải sản phẩm...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1>Tất Cả Sản Phẩm</h1>

      <div>
        <input
          type="text"
          placeholder="Nhập từ khóa và nhấn Enter để tìm..."
          // Giá trị của input được điều khiển bởi inputValue
          value={inputValue}
          // Cập nhật inputValue mỗi khi gõ
          onChange={(e) => setInputValue(e.target.value)}
          // Gắn sự kiện onKeyDown
          onKeyDown={handleKeyDown}
          className={styles.searchBar}
        />
      </div>

      <div className={styles.grid}>
        {cakes.map((cake) => (
          <ProductCard key={cake.idBANH} cake={cake} />
        ))}
      </div>

      <div className={styles.pagination}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Trang Trước
        </button>
        <span style={{ margin: "0 1rem" }}>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage >= totalPages}
        >
          Trang Sau
        </button>
      </div>
    </div>
  );
}
