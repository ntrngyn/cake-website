// src/components/common/FeaturedProducts.tsx
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { cakeApi, Cake } from "../../api/cakeApi";
import ProductCard from "./ProductCard"; // Import ProductCard
import styles from "./FeaturedProducts.module.css";

export default function FeaturedProducts() {
  const [featuredCakes, setFeaturedCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // SỬA LẠI HÀM GỌI API
        const response = await cakeApi.getFeatured();
        // Backend trả về mảng trực tiếp trong data
        setFeaturedCakes(response.data);
      } catch (err) {
        setError("Không thể tải sản phẩm nổi bật.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <Box component="section" className={styles.section}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h2" className={styles.title}>
          Sản Phẩm Nổi Bật
        </Typography>
        <Typography variant="body1" className={styles.subtitle}>
          Những chiếc bánh được yêu thích nhất, làm từ tâm huyết của những người
          thợ làm bánh tài hoa.
        </Typography>

        {loading ? (
          <Box className={styles.loading}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Typography color="error" className={styles.error}>
            {error}
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap", // Cho phép xuống hàng khi không đủ chỗ
              gap: 4, // Khoảng cách giữa các item
              justifyContent: "center", // Căn giữa các item
            }}
          >
            {featuredCakes.map((cake) => (
              // Đặt chiều rộng cho mỗi card
              <Box
                key={cake.idBANH}
                sx={{ width: { xs: "100%", sm: "45%", md: "22%" } }}
              >
                <ProductCard cake={cake} />
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
