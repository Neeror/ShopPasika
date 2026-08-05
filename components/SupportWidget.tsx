"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Headphones, LifeBuoy, Send, X } from "lucide-react";
import {
  botGreeting,
  findBotAnswer,
  quickPrompts,
  supportChannels,
  supportSchedule,
  supportTopics,
} from "@/data/support";
import {
  SUPPORT_CHAT_KEY,
  SUPPORT_TICKETS_KEY,
  createId,
  createTicketNumber,
  formatTime,
  readProfile,
  useStoredList,
  writeProfile,
} from "@/lib/storage";
import type { ChatMessage, SupportTicket } from "@/lib/storage";
import { validateEmail, validateText } from "@/lib/validation";

type Tab = "chat" | "ticket";

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("chat");

  const chat = useStoredList<ChatMessage>(SUPPORT_CHAT_KEY);
  const tickets = useStoredList<SupportTicket>(SUPPORT_TICKETS_KEY);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [topic, setTopic] = useState(supportTopics[0]);
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState("");
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<{ email?: string; text?: string }>({});
  const [createdTicket, setCreatedTicket] = useState<SupportTicket | null>(null);

  const feedRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const profile = readProfile();
    if (profile.contact.includes("@")) setEmail((current) => current || profile.contact);
  }, [open]);

  useEffect(() => {
    if (!open || tab !== "chat") return;
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [open, tab, chat.items.length, typing]);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const sendMessage = (value: string) => {
    const clean = value.trim();
    if (!clean) return;

    chat.append({ id: createId("chat"), role: "user", text: clean, at: new Date().toISOString() });
    setInput("");
    setTyping(true);

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      chat.append({ id: createId("chat"), role: "bot", text: findBotAnswer(clean), at: new Date().toISOString() });
      setTyping(false);
    }, 700);
  };

  const submitTicket = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = {
      email: validateEmail(email) || undefined,
      text: validateText(text, 15) || undefined,
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.text) return;

    const ticket: SupportTicket = {
      id: createId("ticket"),
      number: createTicketNumber(),
      topic,
      order: order.trim(),
      contact: email.trim(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
      status: "new",
    };

    tickets.prepend(ticket);
    writeProfile({ name: readProfile().name, contact: email.trim() });
    setCreatedTicket(ticket);
    setText("");
    setOrder("");
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Відкрити чат підтримки"
          className="support-fab"
        >
          <Headphones size={20} />
          <span className="hidden sm:inline">Підтримка</span>
        </button>
      )}

      {open && (
        <section className="support-panel" role="dialog" aria-label="Підтримка Вулик.Маркет">
          <header className="flex items-start justify-between gap-3 bg-ink px-4 py-4 text-paper">
            <div>
              <p className="flex items-center gap-2 font-semibold">
                <LifeBuoy size={18} className="text-honey" /> Технічна підтримка
              </p>
              <p className="mt-1 text-xs text-paper/60">{supportSchedule} · відповідаємо до 4 годин</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Закрити чат підтримки"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper/10 hover:bg-paper/20"
            >
              <X size={17} />
            </button>
          </header>

          <div className="flex gap-1 border-b border-line bg-[#f1ece3] px-3 pt-3">
            <button
              type="button"
              onClick={() => setTab("chat")}
              className={`rounded-t-lg px-4 py-2 text-sm font-semibold ${tab === "chat" ? "bg-paper" : "text-ink/55 hover:text-ink"}`}
            >
              Чат
            </button>
            <button
              type="button"
              onClick={() => setTab("ticket")}
              className={`rounded-t-lg px-4 py-2 text-sm font-semibold ${tab === "ticket" ? "bg-paper" : "text-ink/55 hover:text-ink"}`}
            >
              Заявка
            </button>
          </div>

          {tab === "chat" ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div ref={feedRef} className="support-feed">
                <p className="support-bubble support-bubble-bot">{botGreeting}</p>

                {chat.items.map((message) => (
                  <p
                    key={message.id}
                    className={`support-bubble ${message.role === "bot" ? "support-bubble-bot" : "support-bubble-user"}`}
                  >
                    {message.text}
                    <span className="support-time">{formatTime(message.at)}</span>
                  </p>
                ))}

                {typing && <p className="support-bubble support-bubble-bot text-ink/50">Оператор друкує…</p>}
              </div>

              {chat.items.length === 0 && (
                <div className="flex flex-wrap gap-2 px-4 pb-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="rounded-full border border-line px-3 py-1.5 text-xs hover:border-honey hover:text-honey"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  sendMessage(input);
                }}
                className="flex items-end gap-2 border-t border-line p-3"
              >
                <label className="sr-only" htmlFor="support-input">
                  Повідомлення в підтримку
                </label>
                <input
                  id="support-input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  className="control"
                  placeholder="Опишіть проблему…"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Надіслати повідомлення"
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-ink text-paper transition hover:bg-honey hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send size={17} />
                </button>
              </form>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 text-xs text-ink/55">
                <span className="flex flex-wrap gap-3">
                  {supportChannels.map((channel) => (
                    <a key={channel.id} href={channel.href} className="hover:text-honey">
                      {channel.value}
                    </a>
                  ))}
                </span>
                {chat.items.length > 0 && (
                  <button type="button" onClick={() => chat.save([])} className="underline-offset-4 hover:underline">
                    Очистити чат
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-auto p-4">
              {createdTicket ? (
                <div className="grid gap-4">
                  <div className="flex items-start gap-3 rounded-2xl bg-[#eef5ed] p-4 text-moss">
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                    <div>
                      <b className="block">Заявку створено</b>
                      <p className="mt-1 text-sm text-ink/70">
                        Номер {createdTicket.number}. Відповідь надійде на {createdTicket.contact} протягом 4 годин.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setCreatedTicket(null)}
                      className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm font-semibold hover:border-honey hover:text-honey"
                    >
                      Нова заявка
                    </button>
                    <Link
                      href="/help#tickets"
                      onClick={() => setOpen(false)}
                      className="inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-sm font-semibold text-paper hover:bg-honey hover:text-ink"
                    >
                      Мої звернення
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={submitTicket} noValidate className="grid gap-3">
                  <label className="grid gap-2 text-sm font-semibold">
                    Тема
                    <select value={topic} onChange={(event) => setTopic(event.target.value)} className="control">
                      {supportTopics.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm font-semibold">
                    Email для відповіді
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="control"
                      placeholder="you@example.com"
                      aria-invalid={Boolean(errors.email)}
                    />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </label>

                  <label className="grid gap-2 text-sm font-semibold">
                    Номер замовлення (необовʼязково)
                    <input
                      value={order}
                      onChange={(event) => setOrder(event.target.value)}
                      className="control"
                      placeholder="VM-123456"
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-semibold">
                    Опис проблеми
                    <textarea
                      value={text}
                      onChange={(event) => setText(event.target.value)}
                      maxLength={1500}
                      className="control min-h-28 resize-y"
                      placeholder="Що сталося, на якій сторінці, що очікували побачити"
                      aria-invalid={Boolean(errors.text)}
                    />
                    {errors.text && <span className="field-error">{errors.text}</span>}
                  </label>

                  <button
                    type="submit"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-5 font-semibold text-paper transition hover:bg-honey hover:text-ink"
                  >
                    <Send size={17} /> Створити заявку
                  </button>
                </form>
              )}
            </div>
          )}
        </section>
      )}
    </>
  );
}
