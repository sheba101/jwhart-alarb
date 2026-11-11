
"use client";

import SearchBar from "@/components/common/layout/SearchBar";
import TopCategories from "@/components/home/categories/TopCategories";
import HomeBanner from "@/components/home/HomeBanner";
import TopProductsSlider from "@/components/home/products/TopProducts";

import LeftCornerDecoration from "@/components/common/decoration/LeftCornerDecoration";
import RightCornerDecoration from "@/components/common/decoration/RightCornerDecoration";

export default function Home() {
  const handleScan = () => {
    console.log("فتح ماسح الباركود");
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-x-clip bg-[#faf9f7] pb-24 text-right lg:pb-12"
      dir="rtl"
    >
      <LeftCornerDecoration />
      <RightCornerDecoration />

      {/* شريط البحث */}


      {/* السلايدر الإعلاني */}
      <section className="relative z-10 my-2 sm:my-3">
        <HomeBanner />
      </section>

      {/* التصنيفات */}
      <section className="relative z-10 py-3 sm:py-5">
        <TopCategories />
      </section>

      {/* المنتجات الأكثر طلباً */}
      <section className="relative z-10 py-3 sm:py-5">
        <TopProductsSlider />
      </section>
    </div>
  );
}
