"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Shell from "@/components/Shell";
import SupportChat from "@/components/SupportChat";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

function SellerProfileContent() {
  const params = useSearchParams();
  const seller = params.get("name") ?? "Продавець";
  const sellerProducts = products.filter((product) => product.seller === seller);

  return (
    <Shell>
      <main className="wrap py-12">
        <Link href="/" className="text-sm text-ink/60">← До каталогу</Link>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-5 border-b border-line pb-8">
          <div><p className="text-xs font-bold uppercase tracking-widest text-honey">Профіль продавця</p><h1 className="mt-2 text-4xl">{seller}</h1><p className="mt-2 text-ink/60">Перевірений продавець на Вулик.Маркет</p></div>
          <SupportChat recipient={seller} buttonLabel="Написати продавцю" title={`Повідомлення: ${seller}`} />
        </div>
        <h2 className="mt-10 text-2xl">Оголошення продавця</h2>
        {sellerProducts.length ? <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{sellerProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p className="mt-5 rounded-2xl border border-line p-6 text-ink/60">Активних оголошень немає.</p>}
      </main>
    </Shell>
  );
}

export default function SellerProfilePage() {
  return <Suspense fallback={<main className="min-h-screen bg-paper" aria-busy="true" />}><SellerProfileContent /></Suspense>;
}
