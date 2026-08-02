"use client";

import { useState } from "react";
import Link from "next/link";
import Shell from "@/components/Shell";
import { STOCK_OPTIONS, categories, type StockStatus } from "@/data/products";

export default function Add() {
  const [ok, setOk] = useState(false);
  const [status, setStatus] = useState<StockStatus>("in");

  return (
    <Shell>
      <main className="wrap py-10">
        <Link href="/seller" className="text-sm text-ink/60">← До кабінету продавця</Link>
        <h1 className="mt-4 text-4xl">Додати товар</h1>

        {ok ? (
          <p className="mt-8 rounded-2xl bg-[#eef5ed] p-5 text-moss">
            Картку відправлено на перевірку. Статус наявності зможете міняти в кабінеті будь-коли.
          </p>
        ) : (
          <form onSubmit={(event) => { event.preventDefault(); setOk(true); }} className="mt-8 grid gap-4 rounded-2xl border border-line p-6">
            <label className="grid gap-2 text-sm font-semibold">Назва товару<input required className="control min-h-12" placeholder="Вулик Дадан на 10 рамок" /></label>
            <label className="grid gap-2 text-sm font-semibold">Ціна, ₴<input required type="number" min={1} className="control min-h-12" placeholder="4850" /></label>
            <label className="grid gap-2 text-sm font-semibold">Категорія<select className="control min-h-12">{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="grid gap-2 text-sm font-semibold">Опис<textarea className="control min-h-28 resize-y" placeholder="Матеріал, розміри, комплектація" /></label>

            <fieldset className="grid gap-2">
              <legend className="text-sm font-semibold">Статус наявності</legend>
              <div className="mt-1 flex flex-wrap gap-2">
                {STOCK_OPTIONS.filter((option) => option.value !== "hidden").map((option) => (
                  <button key={option.value} type="button" aria-pressed={status === option.value} onClick={() => setStatus(option.value)} className={`min-h-9 rounded-full border px-3 text-xs font-semibold ${status === option.value ? "border-ink bg-ink text-paper" : "border-line text-ink/70 hover:border-honey hover:text-honey"}`}>{option.short}</button>
                ))}
              </div>
              <small className="text-ink/55">Статус можна буде перемкнути й після публікації.</small>
            </fieldset>

            <label className="flex items-center gap-2 text-sm"><input required type="checkbox" /> Підтверджую достовірність даних</label>
            <button className="min-h-12 rounded-full bg-ink px-5 font-semibold text-paper">Відправити на перевірку</button>
          </form>
        )}
      </main>
    </Shell>
  );
}

