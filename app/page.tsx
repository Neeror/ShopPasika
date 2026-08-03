"use client";

import { useMemo, useState, Suspense, useEffect } from "react";
import { ArrowRight, BadgeCheck, CalendarDays, MessagesSquare, PackageCheck, RotateCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Shell from "@/components/Shell";
import ProductCard from "@/components/ProductCard";
import { categories, products, canBuy, isListed } from "@/data/products";
import { useStore } from "@/components/AppState";

function HomeContent() {
  const params = useSearchParams();
  const { statusOf, isRemoved } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    setCategory(params.get("category") ?? "");
  }, [params]);

  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const status = statusOf(product);
        return (
          !isRemoved(product.id) &&
          isListed(status) &&
          (!category || product.category === category) &&
          (!onlyAvailable || canBuy(status)) &&
          (!query || `${product.name} ${product.category} ${product.seller}`.toLowerCase().includes(query.toLowerCase()))
        );
      }),
    [category, onlyAvailable, query, statusOf, isRemoved],
  );

  return (
    <Shell onSearch={setQuery}>
      <main>
        <section className="bg-deep text-paper">
          <div className="wrap grid gap-10 py-16 md:grid-cols-[1.3fr_.7fr] md:py-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-honey">Сезон 2026 · головна качка</p>
              <h1 className="mt-4 text-4xl leading-tight sm:text-6xl">Усе для пасіки. Без <em className="not-italic text-honey">посередників.</em></h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/75">Вулики, інвентар, вощина і плідні матки напряму від українських майстерень і розплідників.</p>
              <div className="mt-8 flex flex-wrap gap-3"><a href="#catalog" className="flex min-h-12 items-center gap-2 rounded-full bg-honey px-6 py-3 font-semibold text-ink">До каталогу <ArrowRight size={17} /></a><a href="/seller/add" className="flex min-h-12 items-center rounded-full border border-paper/30 px-6 py-3 font-semibold hover:border-honey hover:text-honey">Продавати на маркеті</a></div>
            </div>
            <aside className="rounded-2xl border border-paper/15 bg-paper/5 p-6"><div className="flex items-center gap-2 text-honey"><CalendarDays size={18} /><b>Календар пасічника</b></div><h2 className="mt-3 text-2xl">Серпень на пасіці</h2><div className="mt-5 space-y-4 text-sm"><p>1　Відкачка соняшникового меду</p><p>2　Обробка від вароатозу</p><p>3　Формування гнізда на зимівлю</p></div></aside>
          </div>
        </section>
        <section className="border-b border-line bg-[#f1ece3]"><div className="wrap grid gap-5 py-5 sm:grid-cols-2 lg:grid-cols-4"><Trust icon={<BadgeCheck />} title="Перевірені пасіки" text="Документи і ветпаспорт" /><Trust icon={<PackageCheck />} title="Безпечна оплата" text="Гроші після отримання" /><Trust icon={<RotateCcw />} title="Повернення 14 днів" text="Крім живих бджіл" /><Trust icon={<MessagesSquare />} title="Питання продавцю" text="Відповідь за 40 хв" /></div></section>
        <section id="catalog" className="wrap py-14">
          <div className="flex flex-wrap items-end justify-between gap-5"><div><h2 className="text-4xl">{category || "Каталог пасічника"}</h2><p className="mt-2 text-sm text-ink/60">{visibleProducts.length} товарів · оновлено сьогодні</p></div><div className="flex flex-wrap gap-2"><select aria-label="Категорія" value={category} onChange={(event) => { const value = event.target.value; setCategory(value); const url = value ? `/?category=${encodeURIComponent(value)}#catalog` : "/#catalog"; window.history.pushState({}, "", url); window.dispatchEvent(new PopStateEvent("popstate")); }} className="control min-h-11 w-auto"><option value="">Усі категорії</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select><label className="flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm"><input type="checkbox" checked={onlyAvailable} onChange={(event) => setOnlyAvailable(event.target.checked)} /> В наявності</label></div></div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          {!visibleProducts.length && <div className="py-20 text-center"><h3 className="text-2xl">Нічого не знайшли</h3><p className="mt-2 text-ink/60">Змініть пошук або фільтри.</p></div>}
        </section>
      </main>
    </Shell>
  );
}

export default function Home() { return <Suspense fallback={<main className="min-h-screen bg-paper" aria-busy="true" />}><HomeContent /></Suspense>; }
function Trust({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <div className="flex items-center gap-3"><span className="text-honey">{icon}</span><span><b className="block text-sm">{title}</b><small className="text-ink/55">{text}</small></span></div>; }
