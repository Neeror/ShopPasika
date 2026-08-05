"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  Mail,
  Phone,
  Send,
  Star,
  Store,
} from "lucide-react";
import Shell from "@/components/Shell";
import { getProduct, getSeller } from "@/data/products";
import {
  appendMessage,
  findThread,
  parseThreadId,
  readThreads,
  writeThreads,
  type ChatThread,
} from "@/components/chatStore";

type ChatPageProps = {
  params: {
    id: string;
  };
};

const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 1000;

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
  });
}

export default function ChatThreadPage({ params }: ChatPageProps) {
  const threadKey = useMemo(() => safeDecode(params.id), [params.id]);
  const seed = useMemo(() => parseThreadId(threadKey), [threadKey]);
  const product = seed.productId ? getProduct(String(seed.productId)) : undefined;
  const seller = getSeller(seed.recipient);

  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [draft, setDraft] = useState("");
  const feedRef = useRef<HTMLDivElement>(null);
  const prefilled = useRef(false);

  useEffect(() => {
    setThreads(readThreads());
    setHydrated(true);
  }, []);

  const thread = findThread(threads, threadKey);
  const messages = thread?.messages ?? [];

  /** Перше повідомлення підставляємо один раз, далі текст належить користувачу. */
  useEffect(() => {
    if (!hydrated || prefilled.current) {
      return;
    }

    prefilled.current = true;

    if (messages.length || !product) {
      return;
    }

    setDraft(
      `Доброго дня! Цікавить «${product.name}» за ${product.price.toLocaleString(
        "uk-UA",
      )} ₴. Підкажіть, будь ласка, щодо наявності та термінів відправлення.`,
    );
  }, [hydrated, messages.length, product]);

  useEffect(() => {
    const feed = feedRef.current;

    if (feed) {
      feed.scrollTop = feed.scrollHeight;
    }
  }, [messages.length, hydrated]);

  const trimmed = draft.trim();
  const canSend = trimmed.length >= MIN_MESSAGE_LENGTH;

  const send = () => {
    if (!canSend) {
      return;
    }

    const next = appendMessage(
      threads,
      {
        id: threadKey,
        recipient: seed.recipient,
        productId: seed.productId,
        productName: product?.name,
      },
      trimmed,
    );

    setThreads(next);
    writeThreads(next);
    setDraft("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    send();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  return (
    <Shell>
      <main className="wrap py-8">
        <Link
          href="/messages"
          className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink"
        >
          <ArrowLeft size={16} /> Усі повідомлення
        </Link>

        <section className="mt-5 overflow-hidden rounded-2xl border border-line bg-paper shadow-card">
          <header className="flex flex-wrap items-center gap-4 border-b border-line p-5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#f1ece3] font-serif">
              {initials(seed.recipient)}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <b className="text-lg">{seed.recipient}</b>
                {seller?.verified && (
                  <span className="inline-flex items-center gap-1 text-xs text-moss">
                    <BadgeCheck size={14} /> Перевірений
                  </span>
                )}
              </div>

              {seller && (
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/60">
                  <span className="inline-flex items-center gap-1">
                    <Star size={13} fill="#d99632" className="text-honey" />
                    {seller.rating.toFixed(1)} · {seller.reviews} відгуків
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={13} /> Відповідає {seller.responseTime}
                  </span>
                </p>
              )}
            </div>
          </header>

          {product && (
            <Link
              href={`/product/${product.id}`}
              className="flex items-center gap-4 border-b border-line p-4 hover:bg-[#f1ece3]"
            >
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#eee5d6]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </span>
              <span className="min-w-0 flex-1">
                <b className="block truncate text-sm">{product.name}</b>
                <span className="mt-1 block font-serif text-lg">
                  {product.price.toLocaleString("uk-UA")} ₴
                </span>
              </span>
            </Link>
          )}

          <div
            ref={feedRef}
            className="min-h-64 max-h-[min(520px,60vh)] space-y-3 overflow-y-auto bg-[#f1ece3] p-5"
          >
            {!hydrated && (
              <p className="py-10 text-center text-sm text-ink/50">
                Завантажуємо листування…
              </p>
            )}

            {hydrated && !messages.length && (
              <p className="py-10 text-center text-sm text-ink/55">
                Це початок розмови з «{seed.recipient}». Напишіть перше
                повідомлення.
              </p>
            )}

            {messages.map((message, index) => {
              const previous = messages[index - 1];
              const showDay =
                !previous || formatDay(previous.createdAt) !== formatDay(message.createdAt);
              const mine = message.author === "buyer";

              return (
                <div key={message.id} className="space-y-3">
                  {showDay && (
                    <p className="text-center text-[11px] uppercase tracking-widest text-ink/45">
                      {formatDay(message.createdAt)}
                    </p>
                  )}

                  <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                        mine
                          ? "rounded-br-sm bg-ink text-paper"
                          : "rounded-bl-sm border border-line bg-paper"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.text}</p>
                      <time className="mt-1 block text-[10px] opacity-55">
                        {formatTime(message.createdAt)}
                      </time>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-line p-4">
            <label htmlFor="chat-message" className="sr-only">
              Повідомлення
            </label>
            <textarea
              id="chat-message"
              rows={3}
              value={draft}
              maxLength={MAX_MESSAGE_LENGTH}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              className="control resize-y"
              placeholder="Напишіть повідомлення продавцю…"
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <small className="text-xs text-ink/50">
                Мінімум {MIN_MESSAGE_LENGTH} символів · {draft.length}/
                {MAX_MESSAGE_LENGTH}
              </small>
              <button
                type="submit"
                disabled={!canSend}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-6 font-semibold text-paper disabled:cursor-not-allowed disabled:bg-line disabled:text-ink/40"
              >
                <Send size={17} /> Надіслати
              </button>
            </div>
          </form>

          {seller && (
            <div className="border-t border-line bg-[#f8f4ec] p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-ink/45">
                Або напряму
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={`tel:${seller.phone.replace(/[^+\d]/g, "")}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-paper px-4 text-sm font-semibold hover:border-honey hover:text-honey"
                >
                  <Phone size={16} /> {seller.phone}
                </a>
                <a
                  href={`mailto:${seller.email}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-paper px-4 text-sm font-semibold hover:border-honey hover:text-honey"
                >
                  <Mail size={16} /> {seller.email}
                </a>
                <Link
                  href="/seller"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-paper px-4 text-sm font-semibold hover:border-honey hover:text-honey"
                >
                  <Store size={16} /> Профіль продавця
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
    </Shell>
  );
}
