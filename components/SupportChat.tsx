"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type ChatMessage = {
  id: string;
  text: string;
  author: "buyer" | "recipient";
  createdAt: string;
};

type ChatThread = {
  id: string;
  recipient: string;
  productId?: number;
  productName?: string;
  messages: ChatMessage[];
  updatedAt: string;
};

type SupportChatProps = {
  recipient: string;
  productId?: number;
  productName?: string;
  buttonLabel?: string;
  title?: string;
};

const STORAGE_KEY = "pasika-chat-threads";
const BUYER_NAME = "Ви";

function readThreads(): ChatThread[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as ChatThread[];
  } catch {
    return [];
  }
}

function threadId(recipient: string, productId?: number) {
  return `${recipient}:${productId ?? "support"}`;
}

export default function SupportChat({
  recipient,
  productId,
  productName,
  buttonLabel = "Написати продавцю",
  title = "Повідомлення",
}: SupportChatProps) {
  const id = useMemo(() => threadId(recipient, productId), [recipient, productId]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [threads, setThreads] = useState<ChatThread[]>([]);

  useEffect(() => {
    setThreads(readThreads());
  }, []);

  const thread = threads.find((item) => item.id === id);
  const messages = thread?.messages ?? [];

  const persist = (nextThreads: ChatThread[]) => {
    setThreads(nextThreads);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextThreads));
  };

  const sendMessage = () => {
    const text = message.trim();
    if (!text) return;

    const now = new Date().toISOString();
    const nextMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      author: "buyer",
      createdAt: now,
    };
    const currentThread: ChatThread = thread ?? {
      id,
      recipient,
      productId,
      productName,
      messages: [],
      updatedAt: now,
    };
    const nextThread: ChatThread = {
      ...currentThread,
      messages: [...currentThread.messages, nextMessage],
      updatedAt: now,
    };
    const nextThreads = [...threads.filter((item) => item.id !== id), nextThread];

    persist(nextThreads);
    setMessage("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line px-5 font-semibold text-ink hover:border-honey hover:text-honey"
      >
        <MessageCircle size={18} />
        {buttonLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/45 p-4">
          <section className="flex max-h-[min(680px,calc(100vh-2rem))] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-paper shadow-lift">
            <header className="flex items-start justify-between border-b border-line p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-honey">
                  {productName ? "Питання про товар" : "Технічна підтримка"}
                </p>
                <h2 className="mt-1 text-xl font-semibold">{title}</h2>
                <p className="mt-1 text-sm text-ink/60">{recipient}</p>
              </div>
              <button type="button" aria-label="Закрити чат" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-[#f1ece3]"><X size={18} /></button>
            </header>

            <div className="min-h-48 flex-1 space-y-3 overflow-y-auto bg-[#f1ece3] p-5">
              {productName && (
                <div className="rounded-xl border border-line bg-paper p-3 text-sm text-ink/70">
                  Товар: <b>{productName}</b>
                </div>
              )}
              {!messages.length && <p className="py-8 text-center text-sm text-ink/55">Напишіть перше повідомлення.</p>}
              {messages.map((item) => (
                <div key={item.id} className={`flex ${item.author === "buyer" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${item.author === "buyer" ? "rounded-br-sm bg-ink text-paper" : "rounded-bl-sm border border-line bg-paper"}`}>
                    <p>{item.text}</p>
                    <time className="mt-1 block text-[10px] opacity-55">{new Date(item.createdAt).toLocaleString("uk-UA")}</time>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={(event) => { event.preventDefault(); sendMessage(); }} className="flex gap-2 border-t border-line p-4">
              <input value={message} onChange={(event) => setMessage(event.target.value)} className="control min-h-11 flex-1" placeholder="Ваше повідомлення…" aria-label="Повідомлення" />
              <button type="submit" aria-label="Надіслати повідомлення" className="grid h-11 w-11 place-items-center rounded-full bg-ink text-paper disabled:opacity-40" disabled={!message.trim()}><Send size={17} /></button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}

export function getChatThreads(): ChatThread[] {
  return readThreads();
}

export { BUYER_NAME };
