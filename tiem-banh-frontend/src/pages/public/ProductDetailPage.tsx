// src/pages/public/ProductDetailPage.tsx
import { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { cakeApi, Cake } from "../../api/cakeApi";
import { useAppDispatch } from "../../hooks/useRedux";
import { addToCart } from "../../redux/cartSlice";
import { getCategoryFolder } from "../../utils/imageUtils";

// MUI Components
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Link,
} from "@mui/material";
// MUI Icons
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import styles from "./ProductDetailPage.module.css";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const [cake, setCake] = useState<Cake | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      const fetchCakeDetail = async () => {
        setLoading(true);
        setError(null); // Reset lỗi mỗi khi fetch
        try {
          const response = await cakeApi.getById(Number(id));
          setCake(response.data);
        } catch (err) {
          setError(
            "Không thể tải thông tin sản phẩm hoặc sản phẩm không tồn tại."
          );
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchCakeDetail();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (cake) {
      dispatch(addToCart({ ...cake, quantity: quantity }));
    }
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ my: 5 }}>
        {error}
      </Typography>
    );
  }

  if (!cake) {
    return (
      <Typography align="center" sx={{ my: 5 }}>
        Không tìm thấy sản phẩm.
      </Typography>
    );
  }

  const categoryFolder = getCategoryFolder(cake.LoaiBanh?.tenLOAIBANH);
  const imageUrl = `/images/products/${categoryFolder}/${cake.hinhanhBANH}`;

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Link
        component={RouterLink}
        to="/products"
        sx={{ mb: 3, display: "inline-block" }}
      >
        &larr; Quay lại danh sách sản phẩm
      </Link>

      <Grid container spacing={4}>
        {/* Cột hình ảnh */}
        <Grid item xs={12} md={6}>
          <div className={styles.imageContainer}>
            <Box
              component="img"
              src={imageUrl}
              alt={cake.tenBANH}
              sx={{
                width: "100%",
                borderRadius: 2,
                boxShadow: 3,
              }}
              // Thêm onError để phòng trường hợp ảnh bị lỗi
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "https://via.placeholder.com/600x400";
              }}
            />
          </div>
        </Grid>

        {/* Cột thông tin */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontFamily: "'Playfair Display', serif" }}
          >
            {cake.tenBANH}
          </Typography>

          <Typography
            variant="h4"
            color="primary"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(cake.giaBANH)}
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            {cake.motaBANH}
          </Typography>

          {/* Ô chọn số lượng */}
          <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
            <Typography sx={{ mr: 2 }}>Số lượng:</Typography>
            <IconButton
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <RemoveIcon />
            </IconButton>
            <TextField
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              type="number"
              InputProps={{
                inputProps: { min: 1, style: { textAlign: "center" } },
              }}
              sx={{ width: "70px" }}
            />
            <IconButton onClick={() => handleQuantityChange(1)}>
              <AddIcon />
            </IconButton>
          </Box>

          {/* Nút thêm vào giỏ hàng */}
          <Button
            onClick={handleAddToCart}
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ShoppingCartIcon />} // Icon giỏ hàng
            sx={{
              padding: "0.8rem 2.5rem",
              fontSize: "1rem",
              color: "white",
            }}
          >
            Thêm vào giỏ
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
