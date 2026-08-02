"use client";

import { Check } from "lucide-react";
import type { Product } from "@/data/products";
import { STOCK_OPTIONS } from "@/data/products";
import { useStore } from "./AppState";

/**
 * Перемикач статусу товару для продавця.
 * Зміна застосовується миттєво, картку перевидавати не треба.
 */
export default function StatusSwitcher({ product }: { product: Product }) {
  const { statusOf, setStatus } = useStore();
  const current = statusOf(product);

  return (
    <div className="flex flex-wrap gap-2">
      {STOCK_OPTIONS.map((option) => {
        const active = current === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => setStatus(product.id, option.value)}
            className={`flex min-h-9 items-center gap-1 rounded-full border px-3 text-xs font-semibold transition ${
              active
                ? "border-ink bg-ink text-paper"
                : "border-line bg-paper text-ink/70 hover:border-honey hover:text-honey"
            }`}
          >
            {active && <Check size={13} />}
            {option.short}
          </button>
        );
      })}
    </div>
  );
}
