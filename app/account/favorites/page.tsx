"use client";
import Link from "next/link";
import Shell from "@/components/Shell";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { useStore } from "@/components/AppState";
export default function FavoritesPage() { const { favorites } = useStore(); const saved = products.filter((product) => favorites.includes(product.id)); return <Shell><main className="wrap py-12"><Link href="/account" className="text-sm text-ink/60">← До кабінету</Link><h1 className="mt-8 text-4xl">Обране</h1>{saved.length ? <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{saved.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p className="mt-8 text-ink/60">Тут поки порожньо. Натисни сердечко на товарі.</p>}</main></Shell>; }
