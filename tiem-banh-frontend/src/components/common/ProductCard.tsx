// src/components/common/ProductCard.tsx
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useRedux";
import { addToCart } from "../../redux/cartSlice";
import { Cake } from "../../api/cakeApi";
import { getCategoryFolder } from "../../utils/imageUtils";

// MUI Components
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";

import styles from "./ProductCard.module.css";

export default function ProductCard({ cake }: { cake: Cake }) {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn Link điều hướng khi chỉ muốn thêm vào giỏ
    dispatch(addToCart({ ...cake, quantity: 1 }));
  };

  const categoryFolder = getCategoryFolder(cake.LoaiBanh?.tenLOAIBANH);
  const imageUrl = `/images/products/${categoryFolder}/${cake.hinhanhBANH}`;

  return (
    <Card className={styles.card} sx={{ height: "100%" }}>
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <CardActionArea
          component={RouterLink}
          to={`/products/${cake.idBANH}`}
          className={styles.cardLink}
        >
          <CardMedia
            component="img"
            className={styles.media}
            image={imageUrl}
            alt={cake.tenBANH}
            // Thêm onError để phòng trường hợp ảnh bị lỗi
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://via.placeholder.com/400x300";
            }}
          />
          <CardContent className={styles.content}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              className={styles.title}
            >
              {cake.tenBANH}
            </Typography>
            <Typography variant="h6" className={styles.price}>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(cake.giaBANH)}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Box>
      <CardActions sx={{ justifyContent: "center", p: 2 }}>
        <Button
          size="large"
          variant="contained"
          onClick={handleAddToCart}
          className={styles.addButton}
        >
          Thêm vào giỏ
        </Button>
      </CardActions>
    </Card>
  );
}
