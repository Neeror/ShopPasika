"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Shell from "@/components/Shell";
import { STOCK_OPTIONS, categories, type StockStatus } from "@/data/products";

export default function Add() {
  const [ok, setOk] = useState(false);
  const [status, setStatus] = useState<StockStatus>("in");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <Shell>
      <main className="wrap py-10">
        <Link href="/seller" className="text-sm text-ink/60">
          ← До кабінету продавця
        </Link>
        <h1 className="mt-4 text-4xl">Додати товар</h1>

        {ok ? (
          <div className="mt-8 rounded-2xl bg-[#eef5ed] p-5 text-moss">
            <p>Картку відправлено на перевірку.</p>
            {imageFile && (
              <p className="mt-2 text-sm">
                Фото «{imageFile.name}» прикріплено до оголошення.
              </p>
            )}
            <Link href="/seller" className="mt-4 inline-block underline">
              Повернутися до кабінету
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setOk(true);
            }}
            className="mt-8 grid gap-4 rounded-2xl border border-line p-6"
          >
            <label className="grid gap-2 text-sm font-semibold">
              Назва товару
              <input
                required
                className="control min-h-12"
                placeholder="Вулик Дадан на 10 рамок"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              Ціна, ₴
              <input
                required
                type="number"
                min={1}
                className="control min-h-12"
                placeholder="4850"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              Категорія
              <select className="control min-h-12" defaultValue={categories[0]}>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              Опис
              <textarea
                className="control min-h-28 resize-y"
                placeholder="Матеріал, розміри, комплектація"
              />
            </label>

            <div className="grid gap-3">
              <label className="text-sm font-semibold" htmlFor="product-image">
                Фото товару
              </label>
              <input
                id="product-image"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif"
                onChange={handleImageChange}
                className="block w-full rounded-xl border border-line bg-[#f1ece3] p-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:font-semibold file:text-paper"
              />
              <p className="text-xs text-ink/55">
                PNG, JPG, WEBP або AVIF. Фото зберігається як превʼю на фронтенді;
                для постійного збереження потрібне підключення storage.
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
            </div>

            <fieldset className="grid gap-2">
              <legend className="text-sm font-semibold">Статус наявності</legend>
              <div className="mt-1 flex flex-wrap gap-2">
                {STOCK_OPTIONS.filter((option) => option.value !== "hidden").map(
                  (option) => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={status === option.value}
                      onClick={() => setStatus(option.value)}
                      className={`min-h-9 rounded-full border px-3 text-xs font-semibold ${
                        status === option.value
                          ? "border-ink bg-ink text-paper"
                          : "border-line text-ink/70 hover:border-honey hover:text-honey"
                      }`}
                    >
                      {option.short}
                    </button>
                  ),
                )}
              </div>
              <small className="text-ink/55">
                Статус можна буде перемкнути й після публікації.
              </small>
            </fieldset>

            <label className="flex items-center gap-2 text-sm">
              <input required type="checkbox" />
              Підтверджую достовірність даних
            </label>

            <button className="min-h-12 rounded-full bg-ink px-5 font-semibold text-paper">
              Відправити на перевірку
            </button>
          </form>
        )}
      </main>
    </Shell>
  );
}
