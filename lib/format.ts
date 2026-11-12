const soles = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });

export function formatPrice(cents: number): string {
  return soles.format(cents / 100);
}

export function formatDate(sqliteUtc: string): string {
  // SQLite guarda "YYYY-MM-DD HH:MM:SS" en UTC.
  const date = new Date(sqliteUtc.replace(" ", "T") + "Z");
  return date.toLocaleString("es-PE", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Lima" });
}
