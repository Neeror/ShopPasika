"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Plus, Star } from "lucide-react";
import type { Product } from "@/data/products";
import { canBuy, stockLabel, stockTone } from "@/data/products";
import { useStore } from "./AppState";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, favorites, toggleFavorite, statusOf } = useStore();
  const isFavorite = favorites.includes(product.id);
  const status = statusOf(product);
  const buyable = canBuy(status);

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-line bg-paper shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[1/.86] overflow-hidden bg-[#eee5d6]">
        <Link href={`/product/${product.id}`} aria-label={`Відкрити ${product.name}`} className="absolute inset-0 z-0">
          <Image src={product.image} alt={product.name} fill className={`object-cover transition duration-500 group-hover:scale-105 ${buyable ? "" : "opacity-60 grayscale"}`} sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw" />
        </Link>
        {!buyable && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-ink/85 px-3 py-1 text-xs font-semibold text-paper">{stockLabel(status)}</span>
        )}
        <button type="button" aria-label={isFavorite ? "Прибрати з обраного" : "Додати в обране"} aria-pressed={isFavorite} onClick={() => toggleFavorite(product.id)} className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-paper/90 hover:text-wine">
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="flex min-h-[240px] flex-1 flex-col gap-2 p-4">
        <small className="font-bold uppercase tracking-widest text-ink/45">{product.category}</small>
        <Link href={`/product/${product.id}`} className="line-clamp-2 font-semibold hover:text-honey">{product.name}</Link>
        <span className="flex items-center gap-1 text-xs"><Star size={14} fill="#d99632" className="text-honey" /><b>{product.rating.toFixed(1)}</b> · {product.reviews} відгуків</span>
        <span className="flex items-center gap-1 text-xs text-ink/60"><MapPin size={13} />{product.seller}, {product.region}</span>
        <span className={`text-xs font-semibold ${stockTone(status)}`}>● {stockLabel(status)}</span>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <b className="font-serif text-xl">{product.price.toLocaleString("uk-UA")} ₴</b>
          <button type="button" aria-label={buyable ? "Додати в кошик" : "Товар недоступний"} disabled={!buyable} title={buyable ? "Додати в кошик" : stockLabel(status)} onClick={() => addToCart(product)} className="grid h-11 w-11 place-items-center rounded-lg bg-ink text-paper hover:bg-honey hover:text-ink disabled:cursor-not-allowed disabled:bg-line disabled:text-ink/40 disabled:hover:bg-line"><Plus size={18} /></button>
        </div>
      </div>
    </article>
  );
}
