"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import Shell from "@/components/Shell";
import StatusSwitcher from "@/components/StatusSwitcher";
import { useStore } from "@/components/AppState";
import {
  CURRENT_SELLER,
  products,
  stockLabel,
  stockTone,
} from "@/data/products";

export default function Seller() {
  const {
    statusOf,
    isRemoved,
    removeProduct,
    restoreProduct,
  } = useStore();
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const mine = products.filter(
    (product) => product.seller === CURRENT_SELLER,
  );
  const active = mine.filter((product) => !isRemoved(product.id));
  const deleted = mine.filter((product) => isRemoved(product.id));
  const listed = active.filter(
    (product) => statusOf(product) !== "hidden",
  ).length;
  const outOfStock = active.filter(
    (product) => statusOf(product) === "out",
  ).length;

  return (
    <Shell>
      <main className="wrap py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-honey">
              Кабінет продавця
            </p>
            <h1 className="mt-2 text-4xl">{CURRENT_SELLER}</h1>
          </div>

          <Link
            href="/seller/add"
            className="flex min-h-12 items-center rounded-full bg-ink px-6 font-semibold text-paper hover:bg-honey hover:text-ink"
          >
            Додати товар
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <Stat title="Продажі" value="48 260 ₴" />
          <Stat title="Опубліковано" value={String(listed)} />
          <Stat title="Немає в наявності" value={String(outOfStock)} />
          <Stat title="До виплати" value="12 840 ₴" />
        </div>

        <section className="mt-12">
          <h2 className="text-3xl">Мої оголошення</h2>
          <p className="mt-2 text-sm text-ink/60">
            Статус можна змінювати або повністю видалити картку.
          </p>

          <div className="mt-6 grid gap-4">
            {active.map((product) => {
              const status = statusOf(product);
              const confirming = confirmId === product.id;

              return (
                <div
                  key={product.id}
                  className="grid gap-4 rounded-2xl border border-line bg-paper p-4 sm:grid-cols-[104px_1fr]"
                >
                  <div className="relative h-24 w-full overflow-hidden rounded-xl bg-[#eee5d6] sm:w-24">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="104px"
                    />
                  </div>

                  <div className="grid gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/product/${product.id}`}
                          className="font-semibold hover:text-honey"
                        >
                          {product.name}
                        </Link>
                        <p className="text-sm text-ink/60">
                          {product.category} · {product.price.toLocaleString("uk-UA")} ₴
                        </p>
                      </div>

                      <span
                        className={`text-sm font-semibold ${stockTone(status)}`}
                      >
                        ● {stockLabel(status)}
                      </span>
                    </div>

                    <StatusSwitcher product={product} />

                    {confirming ? (
                      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#f7eceb] p-3 text-sm">
                        <span className="text-wine">Видалити картку?</span>
                        <button
                          type="button"
                          onClick={() => {
                            removeProduct(product.id);
                            setConfirmId(null);
                          }}
                          className="min-h-9 rounded-full bg-wine px-4 text-xs font-semibold text-paper"
                        >
                          Так, видалити
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmId(null)}
                          className="min-h-9 rounded-full border border-line px-4 text-xs font-semibold"
                        >
                          Скасувати
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmId(product.id)}
                        className="flex w-fit items-center gap-1 text-sm text-ink/55 hover:text-wine"
                      >
                        <Trash2 size={15} />
                        Видалити картку
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {!active.length && (
              <p className="rounded-2xl border border-line p-6 text-ink/60">
                Активних оголошень немає.
              </p>
            )}
          </div>
        </section>

        {deleted.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl">Видалені</h2>
            <div className="mt-4 grid gap-3">
              {deleted.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-line p-4"
                >
                  <span className="text-ink/55 line-through">{product.name}</span>
                  <button
                    type="button"
                    onClick={() => restoreProduct(product.id)}
                    className="flex min-h-9 items-center gap-1 rounded-full border border-line px-4 text-xs font-semibold hover:border-honey hover:text-honey"
                  >
                    <RotateCcw size={14} />
                    Відновити
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </Shell>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-sm text-ink/60">{title}</p>
      <b className="mt-1 block font-serif text-2xl">{value}</b>
    </div>
  );
}
