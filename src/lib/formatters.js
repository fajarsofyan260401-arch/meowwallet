export function formatRupiah(amount = 0) {
  const isNegative = amount < 0;
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount)).replace(/\s+/g, "");
  return isNegative ? `-${formatted}` : formatted;
}

export function formatTanggalID(dateInput) {
  if (!dateInput) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateInput));
}