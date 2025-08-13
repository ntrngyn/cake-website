// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { router } from "./routes/AppRoutes";
import { store } from "./redux/store";
import { theme } from "./styles/theme";
import "react-toastify/dist/ReactToastify.css";
import { injectStore } from "./api/axiosClient"; // <-- KIỂM TRA IMPORT

// "Tiêm" store vào axios client
injectStore(store); // <-- KIỂM TRA DÒNG NÀY

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />{" "}
        {/* Reset CSS và áp dụng màu nền, màu chữ mặc định từ theme */}
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
