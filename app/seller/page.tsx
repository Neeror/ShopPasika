"use client";

import Image from "next/image";
import Link from "next/link";
import Shell from "@/components/Shell";
import StatusSwitcher from "@/components/StatusSwitcher";
import { useStore } from "@/components/AppState";
import { CURRENT_SELLER, products, stockLabel, stockTone } from "@/data/products";

export default function Seller() {
  const { statusOf } = useStore();
  const mine = products.filter((product) => product.seller === CURRENT_SELLER);
  const listed = mine.filter((product) => statusOf(product) !== "hidden").length;
  const outOfStock = mine.filter((product) => statusOf(product) === "out").length;

  return (
    <Shell>
      <main className="wrap py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-honey">Кабінет продавця</p>
            <h1 className="mt-2 text-4xl">{CURRENT_SELLER}</h1>
          </div>
          <Link href="/seller/add" className="flex min-h-12 items-center rounded-full bg-ink px-6 font-semibold text-paper hover:bg-honey hover:text-ink">Додати товар</Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <Stat title="Продажі" value="48 260 ₴" />
          <Stat title="Опубліковано" value={String(listed)} />
          <Stat title="Немає в наявності" value={String(outOfStock)} />
          <Stat title="До виплати" value="12 840 ₴" />
        </div>

        <section className="mt-12">
          <h2 className="text-3xl">Мої оголошення</h2>
          <p className="mt-2 text-sm text-ink/60">Статус можна змінювати будь-коли після публікації, покупці бачать це одразу.</p>

          <div className="mt-6 grid gap-4">
            {mine.map((product) => {
              const status = statusOf(product);
              return (
                <div key={product.id} className="grid gap-4 rounded-2xl border border-line bg-paper p-4 sm:grid-cols-[104px_1fr]">
                  <div className="relative h-26 w-full overflow-hidden rounded-xl bg-[#eee5d6] sm:h-24 sm:w-24">
                    <Image src={product.image} alt={product.name} fill className="object-cover" sizes="104px" />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <Link href={`/product/${product.id}`} className="font-semibold hover:text-honey">{product.name}</Link>
                        <p className="text-sm text-ink/60">{product.category} · {product.price.toLocaleString("uk-UA")} ₴</p>
                      </div>
                      <span className={`text-sm font-semibold ${stockTone(status)}`}>● {stockLabel(status)}</span>
                    </div>
                    <StatusSwitcher product={product} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
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
