// src/components/layout/Footer.tsx
import {
  Box,
  Container,
  Grid,
  Link as MuiLink,
  Typography,
  IconButton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import styles from "./Footer.module.css"; // <-- BƯỚC 1: IMPORT CSS MODULE

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "text.primary",
        color: "rgba(255, 255, 255, 0.7)", // Màu chữ xám nhạt hơn
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Cột Giới Thiệu - Giảm độ chiếm */}
          <Grid item xs={12} sm={12} md={3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontFamily: "'Playfair Display', serif", color: "white" }}
            >
              Sweet & Savory
            </Typography>
            <Typography variant="body2">
              Nơi mỗi chiếc bánh là một tác phẩm nghệ thuật, mang đến cho bạn
              những khoảnh khắc ngọt ngào nhất.
            </Typography>
          </Grid>

          {/* Cột Links - Tăng độ chiếm */}
          <Grid item xs={6} sm={4} md={3}>
            <Typography variant="h6" className={styles.sectionTitle}>
              Sản Phẩm
            </Typography>
            <MuiLink
              component={RouterLink}
              to="/products?category=1"
              color="inherit"
              className={styles.link}
            >
              Bánh Kem
            </MuiLink>
            <MuiLink
              component={RouterLink}
              to="/products?category=2"
              color="inherit"
              className={styles.link}
            >
              Bánh Quy
            </MuiLink>
            <MuiLink
              component={RouterLink}
              to="/products?category=3"
              color="inherit"
              className={styles.link}
            >
              Bánh Ngọt
            </MuiLink>
            <MuiLink
              component={RouterLink}
              to="/products?category=4"
              color="inherit"
              className={styles.link}
            >
              Bánh Nướng
            </MuiLink>
          </Grid>

          {/* Cột Hỗ Trợ - Tăng độ chiếm */}
          <Grid item xs={6} sm={4} md={3}>
            <Typography variant="h6" className={styles.sectionTitle}>
              Hỗ Trợ
            </Typography>
            <MuiLink
              component={RouterLink}
              to="/about"
              color="inherit"
              className={styles.link}
            >
              Về Chúng Tôi
            </MuiLink>
          </Grid>

          {/* Cột Liên Hệ - Tăng độ chiếm */}
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="h6" className={styles.sectionTitle}>
              Theo Dõi Chúng Tôi
            </Typography>
            <Box>
              <IconButton href="#" sx={{ color: "white" }}>
                <FacebookIcon />
              </IconButton>
              <IconButton href="#" sx={{ color: "white" }}>
                <InstagramIcon />
              </IconButton>
              <IconButton href="#" sx={{ color: "white" }}>
                <TwitterIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Box
          mt={5}
          pt={3}
          sx={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
        >
          <Typography variant="body2" align="center">
            {"Copyright © "}
            <MuiLink color="inherit" href="#">
              Sweet & Savory
            </MuiLink>{" "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
