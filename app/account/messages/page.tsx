"use client";

import Link from "next/link";
import { Clock, MessageCircle, Package, Trash2 } from "lucide-react";
import Shell from "@/components/Shell";
import ContactSellerButton from "@/components/ContactSellerButton";
import { SELLER_MESSAGES_KEY, formatDateTime, useStoredList } from "@/lib/storage";
import type { SellerMessage } from "@/lib/storage";
import { replyLabel, resolveSeller } from "@/data/sellers";

const statusLabels: Record<SellerMessage["status"], string> = {
  sent: "Надіслано",
  read: "Прочитано",
  answered: "Є відповідь",
};

export default function AccountMessages() {
  const { items, hydrated, save } = useStoredList<SellerMessage>(SELLER_MESSAGES_KEY);

  const remove = (id: string) => save(items.filter((item) => item.id !== id));

  return (
    <Shell>
      <main className="wrap py-12">
        <Link href="/account" className="text-sm text-ink/60">← Кабінет</Link>
        <p className="mt-4 text-xs uppercase tracking-widest text-honey">Листування</p>
        <h1 className="mt-3 text-4xl">Повідомлення продавцям</h1>
        <p className="mt-3 max-w-2xl text-ink/65">
          Тут зберігаються всі питання, які ви надсилали через кнопку «Написати продавцю».
        </p>

        {!hydrated ? (
          <p className="mt-8 text-sm text-ink/50">Завантаження…</p>
        ) : items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line py-16 text-center">
            <MessageCircle size={28} className="mx-auto text-honey" />
            <h2 className="mt-4 text-2xl">Повідомлень ще немає</h2>
            <p className="mt-2 text-ink/60">Відкрийте будь-який товар і натисніть «Написати продавцю».</p>
            <Link href="/" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-semibold text-paper hover:bg-honey hover:text-ink">
              До каталогу
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {items.map((message) => {
              const seller = resolveSeller(message.sellerName);

              return (
                <article key={message.id} className="rounded-2xl border border-line bg-paper p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink font-serif text-paper">{seller.initials}</span>
                      <div>
                        <Link href={`/seller/${message.sellerSlug}`} className="font-semibold underline-offset-4 hover:text-honey hover:underline">
                          {message.sellerName}
                        </Link>
                        <p className="text-xs text-ink/55">{message.topic}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#f1ece3] px-3 py-1 text-xs font-semibold">{statusLabels[message.status]}</span>
                  </div>

                  {message.productName && (
                    <p className="mt-3 flex items-center gap-2 text-sm text-ink/60">
                      <Package size={14} />
                      <Link href={`/product/${message.productId}`} className="underline-offset-4 hover:text-honey hover:underline">
                        {message.productName}
                      </Link>
                    </p>
                  )}

                  <p className="mt-3 whitespace-pre-line leading-relaxed text-ink/70">{message.text}</p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-xs text-ink/50">
                    <span className="flex flex-wrap items-center gap-3">
                      <span>{formatDateTime(message.createdAt)}</span>
                      <span className="inline-flex items-center gap-1"><Clock size={12} /> відповідь {replyLabel(seller.replyMinutes)}</span>
                      <span>Контакт: {message.contact}</span>
                    </span>
                    <span className="flex flex-wrap gap-2">
                      <ContactSellerButton sellerName={message.sellerName} variant="inline" label="Написати ще" />
                      <button
                        type="button"
                        onClick={() => remove(message.id)}
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-xs font-semibold text-wine hover:border-wine"
                      >
                        <Trash2 size={14} /> Видалити
                      </button>
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </Shell>
  );
}
