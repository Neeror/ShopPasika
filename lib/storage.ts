"use client";

import { useCallback, useEffect, useState } from "react";

export const SELLER_MESSAGES_KEY = "pasika-seller-messages";
export const SUPPORT_TICKETS_KEY = "pasika-support-tickets";
export const SUPPORT_CHAT_KEY = "pasika-support-chat";
export const CONTACT_PROFILE_KEY = "pasika-contact-profile";
export const STORAGE_EVENT = "pasika-storage";

export type SellerMessage = {
  id: string;
  sellerSlug: string;
  sellerName: string;
  productId: number | null;
  productName: string | null;
  topic: string;
  name: string;
  contact: string;
  text: string;
  createdAt: string;
  status: "sent" | "read" | "answered";
};

export type SupportTicket = {
  id: string;
  number: string;
  topic: string;
  order: string;
  contact: string;
  text: string;
  createdAt: string;
  status: "new" | "progress" | "closed";
};

export type ChatMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
  at: string;
};

export type ContactProfile = {
  name: string;
  contact: string;
};

export function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createTicketNumber() {
  return `VM-${Math.floor(100000 + Math.random() * 899999)}`;
}

export function readList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function writeList<T>(key: string, items: T[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
  } catch {
    return;
  }
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: key }));
}

export function readProfile(): ContactProfile {
  if (typeof window === "undefined") return { name: "", contact: "" };
  try {
    const raw = window.localStorage.getItem(CONTACT_PROFILE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed === "object") {
      return {
        name: typeof parsed.name === "string" ? parsed.name : "",
        contact: typeof parsed.contact === "string" ? parsed.contact : "",
      };
    }
  } catch {
    return { name: "", contact: "" };
  }
  return { name: "", contact: "" };
}

export function writeProfile(profile: ContactProfile) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONTACT_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    return;
  }
}

export function useStoredList<T>(key: string) {
  const [items, setItems] = useState<T[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setItems(readList<T>(key));
    sync();
    setHydrated(true);
    window.addEventListener(STORAGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(STORAGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [key]);

  const save = useCallback((next: T[]) => {
    writeList(key, next);
    setItems(next);
  }, [key]);

  const prepend = useCallback((item: T) => {
    const next = [item, ...readList<T>(key)];
    writeList(key, next);
    setItems(next);
    return next;
  }, [key]);

  const append = useCallback((item: T) => {
    const next = [...readList<T>(key), item];
    writeList(key, next);
    setItems(next);
    return next;
  }, [key]);

  return { items, hydrated, save, prepend, append };
}

export function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("uk-UA", {
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}
