import type { Metadata, Viewport } from "next";
import Header from '../components/Header'
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js PWA",
  description: "Une Progressive Web App avec Next.js",
};

export const viewport: Viewport = {
  themeColor: "#778beb",
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="fr">
      <head>
        <meta name="theme-color" content="#778beb" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <ServiceWorkerRegister /> 
      </body>
    </html>
  );
}
