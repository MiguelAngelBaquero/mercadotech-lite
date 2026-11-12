import type { DatabaseSync as Database } from "node:sqlite";
import { hashPassword } from "./password";

export const ADMIN_EMAIL = "admin@mercadotech.pe";
export const ADMIN_PASSWORD = "admin1234";

type SeedProduct = {
  name: string;
  description: string;
  category: string;
  price: number; // soles
  stock: number;
  hue: number;
};

const PRODUCTS: SeedProduct[] = [
  {
    name: "Nova Book 14 Pro",
    description:
      "Laptop de 14\" con pantalla 2.8K de 120 Hz, procesador de 8 núcleos, 16 GB de RAM y 1 TB SSD. Chasis de aluminio de 1.4 kg y hasta 14 horas de batería.",
    category: "laptops",
    price: 4299,
    stock: 8,
    hue: 230,
  },
  {
    name: "Nova Book Air 13",
    description:
      "Ultraligera de 13.3\" Full HD, 8 GB de RAM y 512 GB SSD. Ideal para estudiar y trabajar en movimiento, con carga rápida USB-C.",
    category: "laptops",
    price: 2899,
    stock: 12,
    hue: 200,
  },
  {
    name: "Titan X16 Gamer",
    description:
      "Laptop gamer de 16\" QHD a 240 Hz, gráficos dedicados de 8 GB, 32 GB de RAM y teclado RGB por zonas. Refrigeración con doble ventilador.",
    category: "laptops",
    price: 6499,
    stock: 4,
    hue: 280,
  },
  {
    name: "Pulse S24",
    description:
      "Smartphone de 6.7\" AMOLED 120 Hz, triple cámara de 50 MP, 256 GB de almacenamiento y batería de 5000 mAh con carga de 45 W.",
    category: "celulares",
    price: 2499,
    stock: 15,
    hue: 330,
  },
  {
    name: "Pulse A15",
    description:
      "Celular de 6.5\" con 128 GB, cámara de 48 MP y batería para dos días. El equilibrio entre precio y rendimiento.",
    category: "celulares",
    price: 899,
    stock: 30,
    hue: 160,
  },
  {
    name: "Tab Studio 11",
    description:
      "Tablet de 11\" 2K con lápiz incluido, 8 GB de RAM y 256 GB. Cuatro parlantes y soporte para teclado magnético.",
    category: "tablets",
    price: 1599,
    stock: 10,
    hue: 190,
  },
  {
    name: "Aura ANC Pro",
    description:
      "Audífonos inalámbricos over-ear con cancelación activa de ruido, 40 horas de batería y modo ambiente. Plegables, con estuche rígido.",
    category: "audio",
    price: 599,
    stock: 20,
    hue: 260,
  },
  {
    name: "Aura Studio Lite",
    description:
      "Audífonos on-ear Bluetooth 5.3, livianos y con micrófono para llamadas. 30 horas de reproducción y carga USB-C.",
    category: "audio",
    price: 249,
    stock: 40,
    hue: 20,
  },
  {
    name: "Vista 27 QHD 165 Hz",
    description:
      "Monitor de 27\" IPS 2560×1440 a 165 Hz, 1 ms y HDR10. Base regulable en altura y entradas HDMI 2.1 y DisplayPort.",
    category: "monitores",
    price: 1199,
    stock: 7,
    hue: 210,
  },
  {
    name: "Vista 34 UltraWide",
    description:
      "Monitor curvo de 34\" 3440×1440 para productividad y juego. USB-C con 90 W de carga para tu laptop.",
    category: "monitores",
    price: 1899,
    stock: 3,
    hue: 250,
  },
  {
    name: "Pulse Watch 3",
    description:
      "Reloj inteligente con pantalla AMOLED, GPS, monitoreo de ritmo cardiaco y sueño, y resistencia al agua 5 ATM. Hasta 10 días de batería.",
    category: "wearables",
    price: 749,
    stock: 18,
    hue: 140,
  },
  {
    name: "Combo Teclado Mecánico + Mouse",
    description:
      "Teclado mecánico compacto con switches rojos e iluminación blanca, más mouse inalámbrico de 4000 DPI. Distribución en español.",
    category: "accesorios",
    price: 329,
    stock: 25,
    hue: 30,
  },
];

/** Carga el administrador y los productos de ejemplo solo si la base está vacía. */
export function seed(db: Database) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const users = db.prepare("SELECT COUNT(*) AS n FROM users").get() as { n: number };
    if (users.n === 0) {
      db.prepare("INSERT INTO users (name, email, password_hash, is_admin) VALUES (?, ?, ?, 1)").run(
        "Administrador",
        ADMIN_EMAIL,
        hashPassword(ADMIN_PASSWORD),
      );
    }
    const products = db.prepare("SELECT COUNT(*) AS n FROM products").get() as { n: number };
    if (products.n === 0) {
      const insert = db.prepare(
        "INSERT INTO products (name, description, category, price_cents, stock, hue) VALUES (?, ?, ?, ?, ?, ?)",
      );
      for (const p of PRODUCTS) {
        insert.run(p.name, p.description, p.category, Math.round(p.price * 100), p.stock, p.hue);
      }
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}
