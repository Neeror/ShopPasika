"use client";

import Link from "next/link";
import Shell from "@/components/Shell";
import { useStore } from "@/components/AppState";

export default function Seller() {
  const { customProducts, removeProduct } = useStore();
  const catalogValue = customProducts.reduce((sum, product) => sum + product.price, 0);
  const activeProducts = customProducts.filter((product) => product.stock !== "pre").length;

  return (
    <Shell>
      <main className="wrap py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-honey">Кабінет продавця</p>
            <h1 className="mt-2 text-4xl">Мої товари</h1>
            <p className="mt-2 text-ink/60">Пасіка Бортник · {customProducts.length} товарів</p>
          </div>
          <Link href="/seller/add" className="rounded-full bg-ink px-6 py-3 font-semibold text-paper">
            Додати товар
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-[#f1ece3] p-5"><small>Мої товари</small><b className="mt-2 block text-3xl">{customProducts.length}</b></div>
          <div className="rounded-2xl bg-[#f1ece3] p-5"><small>Вартість каталогу</small><b className="mt-2 block text-3xl">{catalogValue.toLocaleString("uk-UA")} ₴</b></div>
          <div className="rounded-2xl bg-[#f1ece3] p-5"><small>Активні товари</small><b className="mt-2 block text-3xl">{activeProducts}</b></div>
        </div>

        {!customProducts.length ? (
          <div className="mt-8 rounded-2xl border border-line p-8 text-center">
            <h2 className="text-2xl">Ти ще нічого не виставив</h2>
            <Link href="/seller/add" className="mt-4 inline-block text-honey">Створити перший товар →</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {customProducts.map((product) => (
              <article key={product.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line p-5">
                <div>
                  <Link href={`/product/${product.id}`} className="text-xl font-semibold hover:text-honey">{product.name}</Link>
                  <p className="mt-1 text-sm text-ink/60">{product.category} · {product.price.toLocaleString("uk-UA")} ₴</p>
                  <p className="mt-2 text-sm">{product.stock === "in" ? "● В наявності" : product.stock === "low" ? "● Залишилось мало" : "● Передзамовлення"}</p>
                </div>
                <button type="button" onClick={() => { if (window.confirm("Видалити цей товар?")) removeProduct(product.id); }} className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-700">
                  Видалити
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    </Shell>
  );
}
