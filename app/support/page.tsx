"use client";

import Link from "next/link";
import Shell from "@/components/Shell";
import SupportChat from "@/components/SupportChat";

export default function SupportPage() {
  return (
    <Shell>
      <main className="wrap py-12">
        <section className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-honey">Служба турботи</p>
          <h1 className="mt-3 text-4xl">Технічна підтримка</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/70">Проблема із замовленням, оплатою, оголошенням або акаунтом? Створіть звернення, воно зʼявиться в inbox адміністратора на цьому frontend.</p>
          <div className="mt-7"><SupportChat recipient="Адміністратор Вулик.Маркет" buttonLabel="Відкрити чат підтримки" title="Звернення до адміністратора" /></div>
        </section>

        <section className="mt-14 grid gap-4 sm:grid-cols-3">
          <Link href="/messages" className="rounded-2xl border border-line p-5 hover:border-honey"><b>Мої повідомлення</b><p className="mt-2 text-sm text-ink/60">Усі діалоги в одному місці</p></Link>
          <Link href="/seller" className="rounded-2xl border border-line p-5 hover:border-honey"><b>Кабінет продавця</b><p className="mt-2 text-sm text-ink/60">Керування оголошеннями</p></Link>
          <Link href="/" className="rounded-2xl border border-line p-5 hover:border-honey"><b>До каталогу</b><p className="mt-2 text-sm text-ink/60">Повернутися до товарів</p></Link>
        </section>
      </main>
    </Shell>
  );
}
