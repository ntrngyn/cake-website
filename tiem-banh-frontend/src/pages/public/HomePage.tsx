// src/pages/public/HomePage.tsx
import HeroBanner from "../../components/common/HeroBanner";
import FeaturedProducts from "../../components/common/FeaturedProducts";
import AboutUsTeaser from "../../components/common/AboutUsTeaser";

export default function HomePage() {
  return (
    <div>
      <HeroBanner />
      <FeaturedProducts />
      <AboutUsTeaser />
    </div>
  );
}
