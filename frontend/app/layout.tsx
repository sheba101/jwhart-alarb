import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

import QueryProvider from "@/providers/query-provider";
import CartProvider from "@/providers/cart-provider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

const SITE_URL = "https://your-domain.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "جوهرة العرب | مصنع الأدوات البلاستيكية في المكلا",
    template: "%s | جوهرة العرب",
  },

  description:
    "جوهرة العرب، مصنع للأدوات البلاستيكية في اليمن - حضرموت - المكلا - الشرج. نوفر تشكيلة متنوعة من المنتجات والعبوات والعلب البلاستيكية لتلبية احتياجات تجارة الجملة والتجزئة.",

  applicationName: "جوهرة العرب",

  keywords: [
    "جوهرة العرب",
    "مصنع جوهرة العرب",
    "مصنع أدوات بلاستيكية",
    "مصنع بلاستيك في اليمن",
    "مصانع البلاستيك في المكلا",
    "أدوات بلاستيكية بالجملة",
    "منتجات بلاستيكية",
    "عبوات بلاستيكية",
    "علب بلاستيكية",
    "عبوات غذائية",
    "المكلا",
    "الشرج",
    "حضرموت",
    "اليمن",
  ],

  authors: [
    {
      name: "جوهرة العرب",
    },
  ],

  creator: "جوهرة العرب",
  publisher: "جوهرة العرب",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "ar_YE",
    url: SITE_URL,
    siteName: "جوهرة العرب",
    title: "جوهرة العرب | مصنع الأدوات البلاستيكية في المكلا",
    description:
      "جوهرة العرب للأدوات البلاستيكية - المكلا، الشرج، حضرموت، اليمن. منتجات بلاستيكية لتجارة الجملة والتجزئة.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "جوهرة العرب - مصنع الأدوات البلاستيكية",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "جوهرة العرب | مصنع الأدوات البلاستيكية",
    description:
      "مصنع الأدوات البلاستيكية في المكلا - الشرج - حضرموت - اليمن.",
    images: ["/images/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#fcfbf9] font-sans text-gray-900 selection:bg-[#df6951]/20 selection:text-[#004b79]">
        <QueryProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}