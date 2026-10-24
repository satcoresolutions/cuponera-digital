import type { Metadata, Viewport } from "next";

import { Sora } from "next/font/google";

import JsonLd from "@/components/JsonLd";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { Footer } from "@/components/footer";

import { THEME_KEY } from "@/lib/constants";
import { SITE } from "@/lib/seo";

import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const title = `${SITE.name} · ${SITE.brand}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),

  title: {
    default: title,
    template: `%s · ${SITE.brand}`,
  },

  description: SITE.description,

  keywords: [...SITE.keywords],

  applicationName: SITE.name,

  authors: [
    {
      name: SITE.brand,
    },
  ],

  creator: SITE.brand,
  publisher: SITE.brand,

  category: "shopping",

  alternates: {
    canonical: "/",
  },

  manifest: "/manifest.webmanifest",

  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    title,
    description: SITE.description,
    locale: SITE.locale,
  },

  twitter: {
    card: "summary_large_image",
    title,
    description: SITE.description,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  appleWebApp: {
    capable: true,
    title: SITE.name,
    statusBarStyle: "black-translucent",
  },

  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  icons: {
    icon: [
      {
        url: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  width: "device-width",
  initialScale: 1,
};

const themeScript = `
  try {
    if (localStorage.getItem("${THEME_KEY}") === "light") {
      document.documentElement.classList.remove("dark");
    }
  } catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`dark ${sora.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: themeScript,
          }}
        />

        <JsonLd />
      </head>

      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}

        <ServiceWorkerRegister />

        <Footer />
      </body>
    </html>
  );
}
