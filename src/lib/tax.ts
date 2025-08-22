// src/lib/tax.ts
export type Item = {
  qty: number;
  unit: number;
  taxRate: number; // 10 / 8 / 0
  taxIncluded: boolean;
};

export type Summary = {
  buckets: Record<string, { net: number; tax: number }>; // "10%": {net,tax}
  subtotal: number;
  taxTotal: number;
  total: number;
};

function round(n: number) {
  return Math.round(n); // 必要に応じて切上/切捨へ変更可
}

export function summarize(items: Item[]): Summary {
  const buckets: Record<string, { net: number; tax: number }> = {};
  for (const it of items) {
    const raw = it.qty * it.unit;
    const r = it.taxRate / 100;
    const net = it.taxIncluded ? raw / (1 + r) : raw;
    const tax = net * r;
    const k = `${it.taxRate}%`;
    buckets[k] ??= { net: 0, tax: 0 };
    buckets[k].net += net;
    buckets[k].tax += tax;
  }
  let subtotal = 0,
    taxTotal = 0;
  for (const k in buckets) {
    buckets[k].net = round(buckets[k].net);
    buckets[k].tax = round(buckets[k].tax);
    subtotal += buckets[k].net;
    taxTotal += buckets[k].tax;
  }
  return { buckets, subtotal, taxTotal, total: subtotal + taxTotal };
}
