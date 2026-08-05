"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import Shell from "@/components/Shell";
import {
  readThreads,
  sortThreads,
  threadHref,
  type ChatThread,
} from "@/components/chatStore";

export default function MessagesPage() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setThreads(sortThreads(readThreads()));
    setHydrated(true);
  }, []);

  return (
    <Shell>
      <main className="wrap py-12">
        <p className="text-xs font-bold uppercase tracking-widest text-honey">
          Ваші звернення
        </p>
        <h1 className="mt-3 text-4xl">Повідомлення</h1>

        {!hydrated && (
          <p className="mt-8 text-sm text-ink/50">Завантажуємо листування…</p>
        )}

        {hydrated && !threads.length && (
          <div className="mt-8 rounded-2xl border border-line p-8 text-center text-ink/60">
            Поки що повідомлень немає. Напишіть продавцю або адміністратору.
          </div>
        )}

        {hydrated && threads.length > 0 && (
          <div className="mt-8 grid gap-3">
            {threads.map((thread) => (
              <Link
                key={thread.id}
                href={threadHref(thread.id)}
                className="rounded-2xl border border-line p-5 hover:border-honey"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <b className="inline-flex items-center gap-2">
                    <MessageCircle size={16} className="text-honey" />
                    {thread.recipient}
                  </b>
                  <time className="text-xs text-ink/50">
                    {new Date(thread.updatedAt).toLocaleString("uk-UA")}
                  </time>
                </div>

                {thread.productName && (
                  <p className="mt-1 text-sm text-ink/60">{thread.productName}</p>
                )}

                <p className="mt-3 line-clamp-2 text-sm text-ink/70">
                  {thread.messages.at(-1)?.text}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </Shell>
  );
}
