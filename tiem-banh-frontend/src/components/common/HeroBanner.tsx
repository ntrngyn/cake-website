// src/components/common/HeroBanner.tsx
import { Box, Button, Container, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

// Import CSS Module
import styles from "./HeroBanner.module.css";

// Import hình ảnh của bạn
import heroImage from "/images/banner/banner-01.png"; // <-- Thay tên file nếu cần

export default function HeroBanner() {
  return (
    <Box className={styles.hero}>
      {/* Ảnh nền */}
      <img
        src={heroImage}
        alt="Bakery background"
        className={styles.backgroundImage}
      />

      {/* Nội dung */}
      <Container className={styles.content}>
        <Typography className={styles.title} variant="h1" component="h1">
          Nơi Mỗi Chiếc Bánh Là Một Tác Phẩm Nghệ Thuật
        </Typography>
        <Typography className={styles.subtitle} variant="h5" component="p">
          Khám phá hương vị tươi ngon, được làm thủ công mỗi ngày từ những
          nguyên liệu tốt nhất.
        </Typography>
        <Button
          component={RouterLink}
          to="/products"
          variant="contained"
          color="primary"
          size="large"
          sx={{
            padding: "1rem 3rem",
            fontSize: "1.2rem",
            borderRadius: "50px",
            color: "white", // Đảm bảo chữ màu trắng trên nền primary
          }}
        >
          Khám Phá Menu
        </Button>
      </Container>
    </Box>
  );
}
