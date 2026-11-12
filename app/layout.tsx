import type { Metadata, Viewport } from "next";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "MercadoTech — Tecnología al mejor precio",
  description: "Laptops, celulares, audio, monitores y accesorios con precios en soles.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1117" },
  ],
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE">
      <body>
        <CartProvider>
          <Header />
          <main className="container main">{children}</main>
          <footer className="site-footer">
            <div className="container">MercadoTech · Demo · Los pedidos no realizan ningún cobro.</div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
