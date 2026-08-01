"use client";

import Link from "next/link";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const passwordsMatch = password.length > 0 && password === confirm;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!passwordsMatch) return;
    setSubmitted(true);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f1ece3] p-4">
      <div className="w-full max-w-xl rounded-2xl bg-paper p-6 shadow-lift sm:p-9">
        <Link href="/" className="text-sm text-ink/60">← Вулик.Маркет</Link>
        {submitted ? <div className="py-14 text-center"><ShieldCheck className="mx-auto text-moss" size={48} /><h1 className="mt-5 text-3xl">Перевірте свою пошту</h1><p className="mt-3 text-ink/60">Ми надіслали посилання для підтвердження акаунта.</p><Link href="/auth/login" className="mt-7 inline-flex rounded-full bg-ink px-6 py-3 font-semibold text-paper">Перейти до входу</Link></div> : <>
          <h1 className="mt-8 text-3xl">Створити акаунт</h1>
          <p className="mt-2 text-ink/60">Один кабінет для покупок, обраного і продажів.</p>
          <form onSubmit={submit} className="mt-7 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-semibold">Імʼя<input required maxLength={60} className="control" /></label><label className="grid gap-2 text-sm font-semibold">Телефон<input required type="tel" pattern="[+0-9 ()-]{10,}" className="control" placeholder="+380" /></label></div>
            <label className="grid gap-2 text-sm font-semibold">Email<input required type="email" className="control" /></label>
            <PasswordField label="Пароль" value={password} onChange={setPassword} visible={showPassword} onToggle={() => setShowPassword(!showPassword)} />
            <PasswordField label="Підтвердити пароль" value={confirm} onChange={setConfirm} visible={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} error={confirm.length > 0 && !passwordsMatch ? "Паролі не збігаються" : undefined} />
            <label className="flex items-start gap-3 text-sm text-ink/65"><input required type="checkbox" className="mt-1 accent-honey" /> Погоджуюсь з умовами користування і політикою приватності.</label>
            <button disabled={!passwordsMatch} className="min-h-12 rounded-full bg-ink px-5 font-semibold text-paper">Створити акаунт</button>
          </form>
          <p className="mt-7 border-t border-line pt-6 text-center text-sm">Вже є акаунт? <Link className="font-semibold text-honey" href="/auth/login">Увійти</Link></p>
        </>}
      </div>
    </main>
  );
}

function PasswordField({ label, value, onChange, visible, onToggle, error }: { label: string; value: string; onChange: (value: string) => void; visible: boolean; onToggle: () => void; error?: string }) {
  return <label className="grid gap-2 text-sm font-semibold">{label}<span className={`flex items-center rounded-xl border bg-[#fbf8f2] ${error ? "border-wine" : "border-[#ded4c5]"}`}><input required minLength={8} type={visible ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-transparent px-4 py-3 outline-none" placeholder="Мінімум 8 символів" /><button type="button" onClick={onToggle} aria-label={visible ? "Сховати пароль" : "Показати пароль"} className="px-4">{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></span>{error && <small className="font-normal text-wine">{error}</small>}</label>;
}
