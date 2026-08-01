"use client";
import Link from "next/link";
import { useState } from "react";
export default function LoginPage() {
  const [submitted, setSubmitted] = useState(false);
  return <main className="grid min-h-screen place-items-center bg-deep p-4"><form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} className="w-full max-w-md rounded-2xl bg-paper p-8"><Link href="/" className="text-sm text-ink/60">← Вулик.Маркет</Link><h1 className="mt-8 text-3xl">Вхід до кабінету</h1>{submitted && <p className="mt-4 rounded-xl bg-[#eef5ed] p-3 text-sm text-moss">Демо-вхід виконано.</p>}<input required type="email" className="control mt-6" placeholder="Email"/><input required minLength={8} type="password" className="control mt-4" placeholder="Пароль від 8 символів"/><button className="mt-5 w-full rounded-full bg-ink px-5 py-3 font-semibold text-paper">Увійти</button><p className="mt-6 text-sm">Немає акаунта? <Link className="text-honey" href="/auth/register">Зареєструватися</Link></p></form></main>;
}
