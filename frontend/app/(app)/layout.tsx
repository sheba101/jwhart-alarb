
import React, { Suspense } from "react";

import Header from "@/components/common/layout/Header";
import BottomNav from "@/components/common/layout/BottomNav";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div className="h-20" />}>
        <Header />
      </Suspense>

      <main className="flex-1 w-full pb-20 lg:pb-0">
        {children}
      </main>

      <Suspense fallback={<div className="h-16 lg:hidden" />}>
        <BottomNav />
      </Suspense>
    </div>
  );
}
