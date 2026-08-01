"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import Shell from "@/components/Shell";
import { useStore } from "@/components/AppState";

export default function CartPage() {
  const { cart, setQuantity, removeFromCart } = useStore();
  const total = cart.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );

  return (
    <Shell>
      <main className="wrap py-12">
        <h1 className="text-4xl">Кошик</h1>

        {!cart.length ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line p-10 text-center">
            <h2 className="text-2xl">Кошик порожній</h2>
            <p className="mt-2 text-ink/60">
              Знайди щось корисне для своєї пасіки.
            </p>
            <Link
              href="/#catalog"
              className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 font-semibold text-paper"
            >
              До каталогу
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <section className="divide-y divide-line rounded-2xl border border-line bg-paper">
              {cart.map((line) => (
                <article
                  key={line.product.id}
                  className="flex flex-wrap items-center gap-4 p-5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-widest text-ink/45">
                      {line.product.category}
                    </p>
                    <h2 className="mt-1 font-semibold">{line.product.name}</h2>
                    <p className="mt-1 text-sm text-ink/60">
                      {line.product.price.toLocaleString("uk-UA")} ₴ / шт.
                    </p>
                  </div>

                  <div className="flex items-center rounded-full border border-line">
                    <button
                      type="button"
                      aria-label="Зменшити кількість"
                      onClick={() =>
                        setQuantity(line.product.id, line.quantity - 1)
                      }
                      className="grid h-10 w-10 place-items-center"
                    >
                      <Minus size={15} />
                    </button>
                    <b className="w-7 text-center">{line.quantity}</b>
                    <button
                      type="button"
                      aria-label="Збільшити кількість"
                      onClick={() =>
                        setQuantity(line.product.id, line.quantity + 1)
                      }
                      className="grid h-10 w-10 place-items-center"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  <b className="w-28 text-right">
                    {(line.product.price * line.quantity).toLocaleString(
                      "uk-UA",
                    )} ₴
                  </b>

                  <button
                    type="button"
                    aria-label="Видалити товар"
                    onClick={() => removeFromCart(line.product.id)}
                    className="text-ink/45 hover:text-wine"
                  >
                    <Trash2 size={18} />
                  </button>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-2xl bg-deep p-6 text-paper">
              <h2 className="text-xl">Разом</h2>
              <div className="mt-6 flex justify-between border-b border-paper/15 pb-4">
                <span>Товари</span>
                <b>{total.toLocaleString("uk-UA")} ₴</b>
              </div>
              <div className="flex justify-between py-4">
                <span>Доставка</span>
                <span className="text-paper/65">за тарифом</span>
              </div>
              <div className="flex justify-between border-t border-paper/15 pt-4 text-lg">
                <b>До сплати</b>
                <b>{total.toLocaleString("uk-UA")} ₴</b>
              </div>
              <Link
                href="/checkout"
                className="mt-6 block rounded-full bg-honey px-5 py-3 text-center font-semibold text-ink"
              >
                Оформити замовлення
              </Link>
            </aside>
          </div>
        )}
      </main>
    </Shell>
  );
}
