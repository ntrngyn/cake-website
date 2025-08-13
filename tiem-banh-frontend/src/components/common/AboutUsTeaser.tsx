// src/components/common/AboutUsTeaser.tsx
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import styles from "./AboutUsTeaser.module.css";
import { Maximize } from "@mui/icons-material";

export default function AboutUsTeaser() {
  return (
    <Box component="section" className={styles.section}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Cột hình ảnh */}
          <Grid item xs={12} md={6}>
            <img
              src="/images/abtUS/abtUsimg2.png"
              alt="Bên trong tiệm bánh"
              className={styles.image}
            />
          </Grid>

          {/* Cột nội dung */}
          <Grid item xs={12} md={6}>
            <Box className={styles.content}>
              <Typography variant="h2" component="h2" className={styles.title}>
                Câu Chuyện Của Chúng Tôi
              </Typography>
              <Typography variant="body1" className={styles.text}>
                Bắt đầu từ một căn bếp nhỏ với niềm đam mê bất tận dành cho
                những chiếc bánh, Sweet & Savory đã ra đời. Chúng tôi tin rằng
                mỗi chiếc bánh không chỉ là món ăn, mà còn là người bạn đồng
                hành trong những khoảnh khắc đáng nhớ.
              </Typography>
              <Box>
                <Button
                  component={RouterLink}
                  to="/about"
                  variant="outlined"
                  color="primary"
                  size="large"
                >
                  Tìm hiểu thêm
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
