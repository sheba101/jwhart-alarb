
"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store"; 

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return children;
}
