// src/pages/public/AboutPage.tsx
import { Container, Typography, Grid, Box, Avatar } from "@mui/material";
import styles from "./AboutPage.module.css";

// MUI Icons
import BakeryDiningIcon from "@mui/icons-material/BakeryDining";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

export default function AboutPage() {
  return (
    <div>
      {/* Header của trang */}
      <Box className={styles.header}>
        <Typography variant="h2" component="h1" className={styles.title}>
          Về Sweet & Savory
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Niềm đam mê tạo nên những chiếc bánh hoàn hảo.
        </Typography>
      </Box>

      <Container maxWidth="lg">
        {/* Section: Câu chuyện */}
        <Grid
          container
          spacing={6}
          alignItems="center"
          className={styles.section}
        >
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontFamily: "'Playfair Display', serif" }}
            >
              Bắt Đầu Từ Gian Bếp Nhỏ
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Sweet & Savory ra đời từ tình yêu mãnh liệt với nghệ thuật làm
              bánh. Từ những mẻ bánh đầu tiên nướng cho gia đình và bạn bè,
              chúng tôi đã nhận ra niềm hạnh phúc khi được chia sẻ những hương
              vị ngọt ngào.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Mỗi sản phẩm tại tiệm đều được làm thủ công bằng cả trái tim, từ
              những nguyên liệu tươi ngon nhất được chọn lọc kỹ càng. Chúng tôi
              tin rằng, một chiếc bánh ngon có thể làm một ngày của bạn trở nên
              tươi sáng hơn.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <img
              src="/images/abtUS/abtUSimg1.png"
              alt="Câu chuyện tiệm bánh"
              className={styles.storyImage}
            />
          </Grid>
        </Grid>

        {/* Section: Giá trị cốt lõi */}
        <Box sx={{ textAlign: "center" }} className={styles.section}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ fontFamily: "'Playfair Display', serif" }}
          >
            Giá Trị Cốt Lõi
          </Typography>
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center", // Căn giữa toàn bộ nhóm
              alignItems: "flex-start",
              flexWrap: "wrap", // Cho phép xuống hàng trên màn hình nhỏ
              gap: 4, // Khoảng cách giữa các item
            }}
          >
            {/* Item 1 */}
            <Box sx={{ maxWidth: "350px" }}>
              <BakeryDiningIcon className={styles.valueIcon} />
              <Typography variant="h5">Chất Lượng</Typography>
              <Typography color="text.secondary">
                Chúng tôi chỉ sử dụng nguyên liệu tươi mới và tốt nhất.
              </Typography>
            </Box>
            {/* Item 2 */}
            <Box sx={{ maxWidth: "350px" }}>
              <FavoriteBorderIcon className={styles.valueIcon} />
              <Typography variant="h5">Đam Mê</Typography>
              <Typography color="text.secondary">
                Mỗi chiếc bánh đều được làm bằng cả tình yêu và sự tận tâm.
              </Typography>
            </Box>
            {/* Item 3 */}
            <Box sx={{ maxWidth: "350px" }}>
              <PeopleOutlineIcon className={styles.valueIcon} />
              <Typography variant="h5">Cộng Đồng</Typography>
              <Typography color="text.secondary">
                Trở thành một phần trong những khoảnh khắc ngọt ngào của bạn.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Section: Đội ngũ */}
        <Box sx={{ textAlign: "center" }} className={styles.section}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ fontFamily: "'Playfair Display', serif" }}
          >
            Gặp Gỡ Đội Ngũ
          </Typography>
          <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6} md={3} className={styles.teamMember}>
              <Avatar
                alt="Jane Doe"
                src="/images/about/team-1.jpg"
                sx={{ width: 120, height: 120, margin: "0 auto 1rem" }}
              />
              <Typography variant="h6">Jane Doe</Typography>
              <Typography color="primary">Bếp Trưởng</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={styles.teamMember}>
              <Avatar
                alt="John Smith"
                src="/images/about/team-2.jpg"
                sx={{ width: 120, height: 120, margin: "0 auto 1rem" }}
              />
              <Typography variant="h6">John Smith</Typography>
              <Typography color="primary">Chuyên gia Pha chế</Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
}
