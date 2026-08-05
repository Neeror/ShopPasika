/**
 * Спільне сховище листувань для чату з продавцем і техпідтримки.
 * Формат і ключ localStorage збігаються з SupportChat, тому обидва
 * інтерфейси показують одні й ті самі розмови.
 */

export type ChatAuthor = "buyer" | "recipient";

export type ChatMessage = {
  id: string;
  text: string;
  author: ChatAuthor;
  createdAt: string;
};

export type ChatThread = {
  id: string;
  recipient: string;
  productId?: number;
  productName?: string;
  messages: ChatMessage[];
  updatedAt: string;
};

export type ThreadSeed = {
  id?: string;
  recipient: string;
  productId?: number;
  productName?: string;
};

export const CHAT_STORAGE_KEY = "pasika-chat-threads";
export const BUYER_NAME = "Ви";

const SUPPORT_SUFFIX = "support";

/** Ідентифікатор розмови: одна гілка на пару «продавець + товар». */
export function threadId(recipient: string, productId?: number) {
  return `${recipient}:${productId ?? SUPPORT_SUFFIX}`;
}

/** Розбирає ідентифікатор назад на отримувача і товар. */
export function parseThreadId(id: string): ThreadSeed {
  const separator = id.lastIndexOf(":");

  if (separator < 0) {
    return { id, recipient: id };
  }

  const recipient = id.slice(0, separator);
  const suffix = id.slice(separator + 1);
  const productId = Number(suffix);
  const hasProduct =
    suffix !== "" && suffix !== SUPPORT_SUFFIX && Number.isFinite(productId);

  return {
    id,
    recipient,
    productId: hasProduct ? productId : undefined,
  };
}

/** Посилання на сторінку конкретної розмови. */
export function threadHref(id: string) {
  return `/messages/${encodeURIComponent(id)}`;
}

export function readThreads(): ChatThread[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as ChatThread[]) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeThreads(threads: ChatThread[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(threads));
  } catch {
    /* сховище недоступне, працюємо лише в памʼяті */
  }
}

export function findThread(threads: ChatThread[], id: string) {
  return threads.find((thread) => thread.id === id);
}

/** Найсвіжіші розмови зверху. */
export function sortThreads(threads: ChatThread[]) {
  return [...threads].sort((first, second) =>
    second.updatedAt.localeCompare(first.updatedAt),
  );
}

export function createMessage(
  text: string,
  author: ChatAuthor = "buyer",
): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text,
    author,
    createdAt: new Date().toISOString(),
  };
}

/** Додає повідомлення в гілку, створюючи її за потреби. */
export function appendMessage(
  threads: ChatThread[],
  seed: ThreadSeed,
  text: string,
  author: ChatAuthor = "buyer",
): ChatThread[] {
  const id = seed.id ?? threadId(seed.recipient, seed.productId);
  const message = createMessage(text, author);
  const existing = findThread(threads, id);
  const base: ChatThread = existing ?? {
    id,
    recipient: seed.recipient,
    productId: seed.productId,
    productName: seed.productName,
    messages: [],
    updatedAt: message.createdAt,
  };
  const next: ChatThread = {
    ...base,
    recipient: seed.recipient || base.recipient,
    productId: seed.productId ?? base.productId,
    productName: seed.productName ?? base.productName,
    messages: [...base.messages, message],
    updatedAt: message.createdAt,
  };

  return [...threads.filter((thread) => thread.id !== id), next];
}
