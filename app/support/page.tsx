"use client";

import Link from "next/link";
import Shell from "@/components/Shell";
import SupportChat from "@/components/SupportChat";

export default function SupportPage() {
  return (
    <Shell>
      <main className="wrap py-12">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-honey">Допомога</p>
          <h1 className="mt-3 text-4xl">Технічна підтримка</h1>
          <p className="mt-4 text-lg leading-relaxed text-ink/70">Є питання щодо замовлення, оголошення або роботи сайту? Напишіть адміністратору.</p>
          <div className="mt-7"><SupportChat recipient="Адміністратор Вулик.Маркет" buttonLabel="Написати адміністратору" title="Технічна підтримка" /></div>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <Link href="/seller" className="rounded-2xl border border-line p-5 hover:border-honey"><b>Я продавець</b><p className="mt-2 text-sm text-ink/60">Керування оголошеннями</p></Link>
          <Link href="/account/orders" className="rounded-2xl border border-line p-5 hover:border-honey"><b>Мої замовлення</b><p className="mt-2 text-sm text-ink/60">Перевірити статус покупки</p></Link>
          <Link href="/" className="rounded-2xl border border-line p-5 hover:border-honey"><b>До каталогу</b><p className="mt-2 text-sm text-ink/60">Повернутися до товарів</p></Link>
        </div>
      </main>
    </Shell>
  );
}
