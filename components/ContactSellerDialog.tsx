"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, CheckCircle2, Clock, Mail, Phone, Send, Star } from "lucide-react";
import Dialog from "./Dialog";
import type { Product } from "@/data/products";
import type { Seller } from "@/data/sellers";
import { formatPhone, replyLabel, sellerHref } from "@/data/sellers";
import { sellerTopics } from "@/data/support";
import {
  SELLER_MESSAGES_KEY,
  createId,
  readProfile,
  useStoredList,
  writeProfile,
} from "@/lib/storage";
import type { SellerMessage } from "@/lib/storage";
import { validateContact, validateName, validateText } from "@/lib/validation";

type ContactSellerDialogProps = {
  open: boolean;
  onClose: () => void;
  seller: Seller;
  product?: Product | null;
};

type Errors = Partial<Record<"name" | "contact" | "text", string>>;

export default function ContactSellerDialog({ open, onClose, seller, product = null }: ContactSellerDialogProps) {
  const { prepend } = useStoredList<SellerMessage>(SELLER_MESSAGES_KEY);
  const [topic, setTopic] = useState(sellerTopics[0]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<SellerMessage | null>(null);

  useEffect(() => {
    if (!open) return;
    const profile = readProfile();
    setName(profile.name);
    setContact(profile.contact);
    setErrors({});
    setSent(null);
    setTopic(sellerTopics[0]);
    setText(
      product
        ? `Доброго дня! Цікавить «${product.name}» за ${product.price.toLocaleString("uk-UA")} ₴. Підкажіть, будь ласка, щодо наявності та термінів відправлення.`
        : `Доброго дня! Маю питання щодо товарів пасіки «${seller.name}».`,
    );
  }, [open, product, seller.name]);

  const validate = (): Errors => ({
    name: validateName(name) || undefined,
    contact: validateContact(contact) || undefined,
    text: validateText(text) || undefined,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    const hasErrors = Object.values(nextErrors).some(Boolean);
    setErrors(nextErrors);
    if (hasErrors) return;

    const message: SellerMessage = {
      id: createId("msg"),
      sellerSlug: seller.slug,
      sellerName: seller.name,
      productId: product ? product.id : null,
      productName: product ? product.name : null,
      topic,
      name: name.trim(),
      contact: contact.trim(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
      status: "sent",
    };

    prepend(message);
    writeProfile({ name: name.trim(), contact: contact.trim() });
    setSent(message);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Написати продавцю"
      subtitle={product ? `Питання про «${product.name}»` : `Пасіка «${seller.name}»`}
    >
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#f1ece3] p-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink font-serif text-lg text-paper">
          {seller.initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 font-semibold">
            {seller.name}
            {seller.verified && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-moss">
                <BadgeCheck size={14} /> Перевірений
              </span>
            )}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-ink/60">
            <span className="inline-flex items-center gap-1">
              <Star size={13} fill="#d99632" className="text-honey" />
              {seller.rating.toFixed(1)} · {seller.reviews} відгуків
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={13} /> Відповідає {replyLabel(seller.replyMinutes)}
            </span>
          </p>
        </div>
      </div>

      {sent ? (
        <div className="mt-5">
          <div className="flex items-start gap-3 rounded-2xl bg-[#eef5ed] p-5 text-moss">
            <CheckCircle2 size={22} className="mt-0.5 shrink-0" />
            <div>
              <b className="block">Повідомлення надіслано</b>
              <p className="mt-1 text-sm text-ink/70">
                {seller.name} зазвичай відповідає {replyLabel(seller.replyMinutes)}. Відповідь надійде на {sent.contact}.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-line p-4 text-sm text-ink/70">
            <b className="block text-ink">Ваше питання</b>
            <p className="mt-2 whitespace-pre-line">{sent.text}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setSent(null)}
              className="inline-flex min-h-12 items-center rounded-full border border-line px-5 font-semibold hover:border-honey hover:text-honey"
            >
              Написати ще
            </button>
            <Link
              href="/account/messages"
              className="inline-flex min-h-12 items-center rounded-full bg-ink px-5 font-semibold text-paper hover:bg-honey hover:text-ink"
            >
              Мої повідомлення
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-12 items-center px-2 text-sm text-ink/60 underline-offset-4 hover:underline"
            >
              Закрити
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold">
            Тема звернення
            <select value={topic} onChange={(event) => setTopic(event.target.value)} className="control">
              {sellerTopics.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              Ваше імʼя
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="control"
                placeholder="Наприклад, Мирослав"
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              Телефон або email
              <input
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                className="control"
                placeholder="+380 67 000 00 00"
                aria-invalid={Boolean(errors.contact)}
              />
              {errors.contact && <span className="field-error">{errors.contact}</span>}
            </label>
          </div>

          <label className="grid gap-2 text-sm font-semibold">
            Повідомлення
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={1000}
              className="control min-h-32 resize-y"
              placeholder="Опишіть питання якнайконкретніше"
              aria-invalid={Boolean(errors.text)}
            />
            <span className="flex justify-between text-xs font-normal text-ink/50">
              {errors.text ? <span className="field-error">{errors.text}</span> : <span>Мінімум 10 символів</span>}
              <span>{text.trim().length}/1000</span>
            </span>
          </label>

          <button
            type="submit"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 font-semibold text-paper transition hover:bg-honey hover:text-ink"
          >
            <Send size={17} /> Надіслати продавцю
          </button>

          <div className="grid gap-2 border-t border-line pt-4 text-sm">
            <span className="text-xs font-bold uppercase tracking-widest text-ink/45">Або напряму</span>
            <div className="flex flex-wrap gap-2">
              <a
                href={`tel:${seller.phone}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 hover:border-honey hover:text-honey"
              >
                <Phone size={15} /> {formatPhone(seller.phone)}
              </a>
              <a
                href={`mailto:${seller.email}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 hover:border-honey hover:text-honey"
              >
                <Mail size={15} /> {seller.email}
              </a>
              <Link
                href={sellerHref(seller.name)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 hover:border-honey hover:text-honey"
              >
                Профіль продавця
              </Link>
            </div>
            <p className="text-xs text-ink/50">Графік роботи: {seller.schedule}</p>
          </div>
        </form>
      )}
    </Dialog>
  );
}
