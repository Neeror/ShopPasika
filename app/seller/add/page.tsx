"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Shell from "@/components/Shell";
import ProductCard from "@/components/ProductCard";
import {
  STOCK_OPTIONS,
  categories,
  type Product,
  type StockStatus,
} from "@/data/products";

const PUBLISHED_LISTINGS_KEY = "pasika-published-listings";
const SELLER_NAME = "Пасіка Бортник";

function readPublishedListings(): Product[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(PUBLISHED_LISTINGS_KEY);
    const parsed = raw ? (JSON.parse(raw) as Product[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePublishedListings(listings: Product[]) {
  try {
    window.localStorage.setItem(PUBLISHED_LISTINGS_KEY, JSON.stringify(listings));
  } catch {
    /* Якщо localStorage недоступний, картка все одно показується на цій сторінці. */
  }
}

export default function AddProductPage() {
  const [published, setPublished] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<StockStatus>("in");

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const price = Number(form.get("price") ?? 0);
    const category = String(form.get("category") ?? categories[0]);
    const description = String(form.get("description") ?? "").trim();
    const now = Date.now();

    const nextProduct: Product = {
      id: now,
      name,
      category,
      price,
      seller: SELLER_NAME,
      region: "Полтавська",
      rating: 0,
      reviews: 0,
      image: imagePreview ?? "/products/hive.svg",
      description,
      stock: status === "in" || status === "low" ? status : "pre",
      reviewsList: [],
    };

    const nextListings = [nextProduct, ...readPublishedListings()];
    writePublishedListings(nextListings);
    setPublished(nextProduct);
  };

  return (
    <Shell>
      <main className="wrap py-10">
        <Link href="/seller" className="text-sm text-ink/60">
          ← До кабінету продавця
        </Link>
        <h1 className="mt-4 text-4xl">Додати товар</h1>

        {published ? (
          <section className="mt-8">
            <div className="rounded-2xl bg-[#eef5ed] p-5 text-moss">
              <p className="font-semibold">Оголошення опубліковано одразу.</p>
              <p className="mt-1 text-sm">
                Картка вже доступна покупцям. Ніякої перевірки або очікування.
              </p>
            </div>

            <div className="mt-7 max-w-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-honey">
                Опублікована картка
              </p>
              <ProductCard product={published} />
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex min-h-11 items-center rounded-full bg-ink px-6 font-semibold text-paper"
              >
                Переглянути картку вище
              </button>
              <button
                type="button"
                onClick={() => {
                  setPublished(null);
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="min-h-11 rounded-full border border-line px-6 font-semibold"
              >
                Додати ще товар
              </button>
            </div>
          </section>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 grid max-w-2xl gap-4 rounded-2xl border border-line p-6"
          >
            <label className="grid gap-2 text-sm font-semibold">
              Назва товару
              <input
                name="name"
                required
                className="control min-h-12"
                placeholder="Наприклад, Вулик Дадан на 10 рамок"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              Ціна, ₴
              <input
                name="price"
                required
                type="number"
                min={1}
                step="1"
                className="control min-h-12"
                placeholder="4850"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              Категорія
              <select name="category" className="control min-h-12" defaultValue={categories[0]}>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              Опис
              <textarea
                name="description"
                required
                minLength={10}
                className="control min-h-28 resize-y"
                placeholder="Опишіть стан, комплектацію та особливості товару"
              />
            </label>

            <div className="grid gap-3">
  <span className="text-sm font-semibold">Фото товару</span>

  <label
    htmlFor="product-image"
    className="inline-flex min-h-11 w-fit cursor-pointer items-center rounded-full bg-ink px-5 font-semibold text-paper transition hover:bg-honey"
  >
    Обрати фото
  </label>

  <input
    id="product-image"
    name="image"
    type="file"
    accept="image/png,image/jpeg,image/webp,image/avif"
    onChange={handleImageChange}
    className="sr-only"
  />

  <p className="text-xs text-ink/55">
    JPG, PNG, WEBP або AVIF. Фото використовується одразу в картці.
  </p>

  {imagePreview && (
    <div className="relative aspect-[16/9] max-w-md overflow-hidden rounded-2xl border border-line bg-[#eee5d6]">
      <Image
        src={imagePreview}
        alt="Попередній перегляд фото товару"
        fill
        unoptimized
        className="object-cover"
      />
    </div>
  )}

  {imageFile && (
    <p className="text-xs text-ink/55">
      {imageFile.name}
    </p>
  )}
</div>


            <fieldset className="grid gap-2">
              <legend className="text-sm font-semibold">Наявність</legend>
              <div className="flex flex-wrap gap-2">
                {STOCK_OPTIONS.filter((option) => option.value !== "hidden").map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={status === option.value}
                    onClick={() => setStatus(option.value)}
                    className={`min-h-9 rounded-full border px-3 text-xs font-semibold ${
                      status === option.value
                        ? "border-ink bg-ink text-paper"
                        : "border-line text-ink/70 hover:border-honey"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="flex items-center gap-2 text-sm">
              <input required type="checkbox" />
              Підтверджую достовірність даних
            </label>

            <button className="min-h-12 rounded-full bg-ink px-5 font-semibold text-paper">
              Опублікувати оголошення
            </button>
          </form>
        )}
      </main>
    </Shell>
  );
}
