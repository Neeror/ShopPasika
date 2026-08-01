import Link from "next/link";
import Shell from "@/components/Shell";
export default function OrdersPage() { return <Shell><main className="wrap py-12"><Link href="/account" className="text-sm text-ink/60">← До кабінету</Link><h1 className="mt-8 text-4xl">Мої замовлення</h1><div className="mt-8 grid gap-4">{["VM-2406 · В дорозі · 5 630 ₴", "VM-1982 · Отримано · 1 240 ₴"].map((order) => <div key={order} className="rounded-xl border border-line p-5">{order}</div>)}</div></main></Shell>; }
