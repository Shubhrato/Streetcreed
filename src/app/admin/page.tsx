import type { Metadata } from "next";
import { mockOrders, products } from "@/lib/data/catalog";
import { pageMetadata } from "@/lib/seo";
import { cn, formatPrice } from "@/lib/utils";

export const metadata: Metadata = { ...pageMetadata("Admin", "STREETCREED admin dashboard.", "/admin"), robots: { index: false } };

export default function AdminPage() {
  const revenue = mockOrders.reduce((s, o) => s + o.total, 0) * 142; // demo multiplier
  const lowStock = products.filter((p) => p.stock <= 10);
  const stats = [
    { label: "Revenue (demo)", value: formatPrice(revenue) },
    { label: "Orders", value: String(mockOrders.length * 71) },
    { label: "Products live", value: String(products.length) },
    { label: "Low-stock alerts", value: String(lowStock.length) },
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-12 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent">STREETCREED Admin</p>
          <h1 className="mt-3 font-display text-5xl leading-[1.02]">Dashboard</h1>
        </div>
        <p className="max-w-sm text-sm text-mist">Read-only demo. Mutations are disabled — connect Prisma + role-based auth to enable product and order management (see prisma/schema.prisma).</p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-line bg-bone/50 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-mist">{s.label}</p>
            <p className="mt-3 font-display text-4xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid items-start gap-10 lg:grid-cols-2">
        <section aria-labelledby="adm-orders">
          <h2 id="adm-orders" className="font-display text-3xl">Recent orders</h2>
          <div className="mt-5 overflow-x-auto border border-line">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-bone/60 text-[11px] uppercase tracking-eyebrow text-mist">
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((o) => (
                  <tr key={o.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3.5 font-medium">{o.id}</td>
                    <td className="px-4 py-3.5 text-mist">{o.date}</td>
                    <td className="px-4 py-3.5">{o.status}</td>
                    <td className="px-4 py-3.5 text-right tabular-nums">{formatPrice(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="adm-inv">
          <h2 id="adm-inv" className="font-display text-3xl">Inventory</h2>
          <div className="mt-5 max-h-[480px] overflow-auto border border-line">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0">
                <tr className="border-b border-line bg-bone text-[11px] uppercase tracking-eyebrow text-mist">
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 text-right font-semibold">Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.slug} className={cn("border-b border-line last:border-0", p.stock <= 10 && "bg-error/5")}>
                    <td className="px-4 py-3">
                      <span className="block font-medium">{p.name}</span>
                      <span className="text-xs text-mist">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn("px-2 py-1 text-xs font-semibold", p.stock <= 10 ? "bg-error text-white" : "bg-bone")}>{p.stock}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
