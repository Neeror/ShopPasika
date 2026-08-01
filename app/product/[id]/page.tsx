"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, MapPin, Minus, Plus, Star, Truck, BadgeCheck } from "lucide-react";
import Shell from "@/components/Shell";
import { getProduct } from "@/data/products";
import { useStore } from "@/components/AppState";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);
  const { addToCart, favorites, toggleFavorite } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSent, setReviewSent] = useState(false);

  if (!product) {
    return (
      <Shell>
        <main className="wrap py-20">
          <h1 className="text-3xl">Товар не знайдено</h1>
          <Link href="/" className="mt-4 inline-block text-honey">До каталогу</Link>
        </main>
      </Shell>
    );
  }

  const isFavorite = favorites.includes(product.id);
  const average = product.reviewsList.reduce((sum, review) => sum + review.rating, 0) / product.reviewsList.length;

  return (
    <Shell>
      <main className="wrap py-10">
        <Link href="/" className="text-sm text-ink/60">← До каталогу</Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#eee5d6]">
            <Image src={product.image} alt={product.name} fill priority className="object-cover" />
          </div>
          <div>
            <small className="font-bold uppercase tracking-widest text-ink/45">{product.category}</small>
            <h1 className="mt-3 text-4xl">{product.name}</h1>
            <p className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <Star size={16} fill="#d99632" className="text-honey" />
              {product.rating.toFixed(1)} · {product.reviews} відгуків
              <MapPin size={16} /> {product.region}
            </p>
            <p className="mt-6 text-lg leading-relaxed text-ink/70">{product.description}</p>
            <b className="mt-8 block font-serif text-4xl">{product.price.toLocaleString("uk-UA")} ₴</b>
            <div className="mt-6 flex gap-3">
              <div className="flex items-center rounded-full border border-line">
                <button type="button" aria-label="Зменшити кількість" className="h-12 w-12" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={15} /></button>
                <b className="w-6 text-center">{quantity}</b>
                <button type="button" aria-label="Збільшити кількість" className="h-12 w-12" onClick={() => setQuantity(quantity + 1)}><Plus size={15} /></button>
              </div>
              <button type="button" className="flex-1 rounded-full bg-ink px-5 font-semibold text-paper" onClick={() => Array.from({ length: quantity }).forEach(() => addToCart(product))}>Додати в кошик</button>
              <button type="button" aria-label="Обране" className="grid h-12 w-12 place-items-center rounded-full border border-line" onClick={() => toggleFavorite(product.id)}><Heart fill={isFavorite ? "currentColor" : "none"} /></button>
            </div>
            <p className="mt-7 flex items-center gap-2 text-sm text-moss"><Truck size={18} /> Відправка протягом 1-2 днів</p>
          </div>
        </div>

        <section className="mt-16 grid gap-10 border-t border-line pt-12 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-honey">Досвід пасічників</p>
                <h2 className="mt-2 text-3xl">Відгуки про товар</h2>
              </div>
              <div className="text-right"><b className="font-serif text-3xl">{average.toFixed(1)}</b><p className="text-sm text-ink/60">середня оцінка</p></div>
            </div>
            <div className="mt-7 divide-y divide-line rounded-2xl border border-line bg-paper">
              {product.reviewsList.map((review) => (
                <article key={review.id} className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3"><div><b>{review.author}</b>{review.verified && <span className="ml-2 inline-flex items-center gap-1 text-xs text-moss"><BadgeCheck size={14} /> Покупка підтверджена</span>}</div><time className="text-xs text-ink/50">{review.date}</time></div>
                  <div className="mt-2 flex gap-1 text-honey">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={15} fill={index < review.rating ? "currentColor" : "none"} />)}</div>
                  <p className="mt-3 leading-relaxed text-ink/70">{review.text}</p>
                </article>
              ))}
            </div>
          </div>

          <form onSubmit={(event) => { event.preventDefault(); setReviewSent(true); setReviewText(""); }} className="h-fit rounded-2xl bg-[#f1ece3] p-6">
            <h2 className="text-2xl">Залишити відгук</h2>
            <p className="mt-2 text-sm text-ink/60">Поділіться досвідом після покупки.</p>
            {reviewSent && <p className="mt-4 rounded-xl bg-[#eef5ed] p-3 text-sm text-moss">Дякуємо, відгук відправлено на перевірку.</p>}
            <fieldset className="mt-5"><legend className="text-sm font-semibold">Оцінка</legend><div className="mt-2 flex gap-1">{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" aria-label={`${value} зірок`} onClick={() => setReviewRating(value)} className="text-honey"><Star size={24} fill={value <= reviewRating ? "currentColor" : "none"} /></button>)}</div></fieldset>
            <label className="mt-5 grid gap-2 text-sm font-semibold">Ваш відгук<textarea required minLength={10} maxLength={1000} value={reviewText} onChange={(event) => setReviewText(event.target.value)} className="control min-h-32 resize-y" placeholder="Що сподобалося?" /></label>
            <button className="mt-5 w-full rounded-full bg-ink px-5 py-3 font-semibold text-paper">Відправити відгук</button>
          </form>
        </section>
      </main>
    </Shell>
  );
}
