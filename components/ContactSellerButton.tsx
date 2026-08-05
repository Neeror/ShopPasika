"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import type { Product } from "@/data/products";
import { resolveSeller } from "@/data/sellers";
import ContactSellerDialog from "./ContactSellerDialog";

type Variant = "card" | "inline" | "primary";

type ContactSellerButtonProps = {
  sellerName: string;
  product?: Product | null;
  variant?: Variant;
  label?: string;
  className?: string;
};

const styles: Record<Variant, string> = {
  card: "grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-line bg-paper transition hover:border-honey hover:bg-honey hover:text-ink",
  inline: "inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold transition hover:border-honey hover:text-honey",
  primary: "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-honey px-5 font-semibold text-ink transition hover:bg-ink hover:text-paper",
};

export default function ContactSellerButton({
  sellerName,
  product = null,
  variant = "inline",
  label,
  className = "",
}: ContactSellerButtonProps) {
  const [open, setOpen] = useState(false);
  const seller = resolveSeller(sellerName);
  const title = label ?? "Написати продавцю";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${title}: ${seller.name}`}
        title={title}
        className={`${styles[variant]} ${className}`.trim()}
      >
        <MessageCircle size={variant === "card" ? 18 : 17} />
        {variant !== "card" && <span>{title}</span>}
      </button>

      <ContactSellerDialog open={open} onClose={() => setOpen(false)} seller={seller} product={product} />
    </>
  );
}
