"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import { categories } from "@/data/products";
import { useStore } from "@/components/AppState";

type FormState = {
  name: string;
  category: string;
  price: string;
  seller: string;
  region: string;
  description: string;
  stock: "in" | "low" | "pre";
};

export default function Add() {
  const router = useRouter();
  const { addProduct } = useStore();
  const [form, setForm] = useState<FormState>({
    name: "",
    category: categories[0],
    price: "",
    seller: "",
    region: "",
    description: "",
    stock: "in",
  });
  const [error, setError] = useState("");

  const update = (key: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const price = Number(form.price);

    if (!form.name.trim()) {
      setError("Вкажіть назву товару.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Ціна має бути числом більшим за нуль.");
      return;
    }

    const id = addProduct({
      name: form.name.trim(),
      category: form.category,
      price,
      seller: form.seller.trim() || "Мій магазин",
      region: form.region.trim() || "Україна",
      rating: 0,
      reviews: 0,
      image: "/products/jar.svg",
      description: form.description.trim() || "Опис буде додано пізніше.",
      stock: form.stock,
    });

    router.push(`/product/${id}`);
  };

  return (
    <Shell>
      <main className="wrap py-10">
        <Link href="/seller" className="text-sm text-ink/60">
          ← До кабінету продавця
        </Link>
        <h1 className="mt-4 text-4xl">Додати товар</h1>

        <form onSubmit={submit} className="mt-8 grid max-w-2xl gap-4 rounded-2xl border border-line p-6">
          <label className="grid gap-2 text-sm font-semibold">
            Назва товару
            <input value={form.name} onChange={update("name")} className="control" placeholder="Вулик Дадан на 10 рамок, липа" />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Категорія
            <select value={form.category} onChange={update("category")} className="control">
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Наявність
            <select value={form.stock} onChange={update("stock")} className="control">
              <option value="in">В наявності</option>
              <option value="low">Залишилось мало</option>
              <option value="pre">Передзамовлення</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Ціна, ₴
            <input value={form.price} onChange={update("price")} inputMode="numeric" className="control" placeholder="4850" />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Продавець
            <input value={form.seller} onChange={update("seller")} className="control" placeholder="Пасіка Бортник" />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Область
            <input value={form.region} onChange={update("region")} className="control" placeholder="Полтавська" />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Опис
            <textarea value={form.description} onChange={update("description")} maxLength={1000} className="control min-h-32 resize-y" placeholder="Матеріал, розміри, комплектація" />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="min-h-12 rounded-full bg-ink px-6 font-semibold text-paper">
            Опублікувати товар
          </button>
        </form>
      </main>
    </Shell>
  );
}
