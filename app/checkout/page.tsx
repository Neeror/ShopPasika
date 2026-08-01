"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, LockKeyhole } from "lucide-react";
import Shell from "@/components/Shell";
import { useStore } from "@/components/AppState";

export default function CheckoutPage() {
  const { cart, clearCart } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const total = cart.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );

  if (submitted) {
    return (
      <Shell>
        <main className="wrap py-20 text-center">
          <CheckCircle2 className="mx-auto text-moss" size={54} />
          <h1 className="mt-5 text-4xl">Замовлення прийнято</h1>
          <p className="mx-auto mt-3 max-w-lg text-ink/60">
            Підтвердження надіслано на вашу пошту. Номер замовлення: VM-260801.
          </p>
          <Link
            href="/account/orders"
            className="mt-7 inline-flex rounded-full bg-ink px-6 py-3 font-semibold text-paper"
          >
            Переглянути замовлення
          </Link>
        </main>
      </Shell>
    );
  }

  return (
    <Shell>
      <main className="wrap py-10">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-ink/60"
        >
          <ArrowLeft size={16} /> До кошика
        </Link>

        <div className="mt-8 flex items-center gap-3">
          <h1 className="text-4xl">Оформлення</h1>
          <LockKeyhole size={19} className="text-moss" />
        </div>

        {!cart.length ? (
          <div className="mt-8 rounded-2xl bg-[#fff3d9] p-6">
            Кошик порожній. <Link href="/#catalog" className="font-semibold text-honey">Повернутися до каталогу</Link>
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              clearCart();
              setSubmitted(true);
            }}
            className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]"
          >
            <section className="grid gap-5 rounded-2xl border border-line bg-paper p-6">
              <h2 className="text-2xl">Дані отримувача</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold">
                  Імʼя
                  <input required className="control" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Телефон
                  <input required type="tel" className="control" placeholder="+380" />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-semibold">
                Місто
                <input required className="control" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Відділення Нової пошти
                <input required className="control" placeholder="Номер або адреса" />
              </label>
              <fieldset className="grid gap-3">
                <legend className="text-sm font-semibold">Оплата</legend>
                <label className="rounded-xl border border-honey bg-[#fff8e9] p-4 text-sm">
                  <input type="radio" name="payment" defaultChecked /> Накладений платіж
                </label>
                <label className="rounded-xl border border-line p-4 text-sm">
                  <input type="radio" name="payment" /> Карткою онлайн
                </label>
              </fieldset>
            </section>

            <aside className="h-fit rounded-2xl bg-deep p-6 text-paper">
              <h2 className="text-xl">Ваше замовлення</h2>
              <div className="mt-5 space-y-3 border-b border-paper/15 pb-5 text-sm">
                {cart.map((line) => (
                  <div key={line.product.id} className="flex justify-between gap-3">
                    <span>{line.product.name} × {line.quantity}</span>
                    <b>{(line.product.price * line.quantity).toLocaleString("uk-UA")} ₴</b>
                  </div>
                ))}
              </div>
              <div className="flex justify-between py-5 text-lg">
                <b>Разом</b>
                <b>{total.toLocaleString("uk-UA")} ₴</b>
              </div>
              <button className="w-full rounded-full bg-honey px-5 py-3 font-semibold text-ink">
                Підтвердити замовлення
              </button>
            </aside>
          </form>
        )}
      </main>
    </Shell>
  );
}
