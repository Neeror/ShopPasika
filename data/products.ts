export type Review = {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
};

/** Статуси, які продавець може перемикати вже після публікації картки. */
export type StockStatus = "in" | "low" | "pre" | "out" | "hidden";

export const STOCK_OPTIONS: {
  value: StockStatus;
  label: string;
  short: string;
  tone: string;
}[] = [
  {
    value: "in",
    label: "В наявності",
    short: "В наявності",
    tone: "text-moss",
  },
  {
    value: "low",
    label: "Залишилось мало",
    short: "Мало",
    tone: "text-honey",
  },
  {
    value: "pre",
    label: "Передзамовлення",
    short: "Передзамовлення",
    tone: "text-ink/60",
  },
  {
    value: "out",
    label: "Немає в наявності",
    short: "Немає",
    tone: "text-wine",
  },
  {
    value: "hidden",
    label: "Знято з публікації",
    short: "Приховано",
    tone: "text-ink/45",
  },
];

export const stockLabel = (status: StockStatus) =>
  STOCK_OPTIONS.find((option) => option.value === status)?.label ?? "";

export const stockTone = (status: StockStatus) =>
  STOCK_OPTIONS.find((option) => option.value === status)?.tone ?? "text-ink/60";

/** Чи можна класти товар у кошик у цьому статусі. */
export const canBuy = (status: StockStatus) =>
  status === "in" || status === "low";

/** Чи показувати картку в каталозі. */
export const isListed = (status: StockStatus) => status !== "hidden";

/** Поки немає бекенду, вважаємо, що залогінений продавець це він. */
export const CURRENT_SELLER = "Пасіка Бортник";

/** Публічна картка продавця: контакти, довіра і швидкість відповіді. */
export type Seller = {
  name: string;
  phone: string;
  email: string;
  verified: boolean;
  rating: number;
  reviews: number;
  responseTime: string;
};

export const SELLERS: Seller[] = [
  {
    name: "Пасіка Бортник",
    phone: "+38 (050) 411-72-30",
    email: "sales@bortnyk.ua",
    verified: true,
    rating: 4.9,
    reviews: 512,
    responseTime: "≈ 15 хв",
  },
  {
    name: "Апітех",
    phone: "+38 (044) 228-01-90",
    email: "sales@apiteh.ua",
    verified: true,
    rating: 4.8,
    reviews: 428,
    responseTime: "≈ 25 хв",
  },
  {
    name: "Розплідник Гуцул",
    phone: "+38 (067) 903-14-58",
    email: "info@hutsul-bee.ua",
    verified: true,
    rating: 4.7,
    reviews: 296,
    responseTime: "≈ 1 год",
  },
  {
    name: "Пасіка Сонцедар",
    phone: "+38 (095) 640-22-17",
    email: "shop@sontsedar.ua",
    verified: false,
    rating: 4.6,
    reviews: 174,
    responseTime: "≈ 40 хв",
  },
];

export const getSeller = (name: string) =>
  SELLERS.find((seller) => seller.name === name);

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  seller: string;
  region: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  stock: StockStatus;
  reviewsList: Review[];
};

export const categories = [
  "Вулики",
  "Інвентар",
  "Матки та бджолопакети",
  "Вощина і рамки",
  "Мед і продукти",
  "Захист",
];

/** Категорія прописана явно, щоб товари не потрапляли в неправильні вкладки. */
const seed: {
  name: string;
  category: string;
  price: number;
  image: string;
  seller: string;
  region: string;
  stock: StockStatus;
}[] = [
  {
    name: "Вулик Дадан на 10 рамок, липа",
    category: "Вулики",
    price: 4850,
    image: "hive",
    seller: "Пасіка Бортник",
    region: "Полтавська",
    stock: "in",
  },
  {
    name: "Медогонка 4-рамкова, нержавійка 304",
    category: "Інвентар",
    price: 12300,
    image: "extractor",
    seller: "Апітех",
    region: "Київська",
    stock: "low",
  },
  {
    name: "Матка карпатка плідна F1, сезон 2026",
    category: "Матки та бджолопакети",
    price: 620,
    image: "queen",
    seller: "Розплідник Гуцул",
    region: "Закарпатська",
    stock: "pre",
  },
  {
    name: "Мед соняшниковий урожай 2026, 3 л",
    category: "Мед і продукти",
    price: 780,
    image: "jar",
    seller: "Пасіка Сонцедар",
    region: "Херсонська",
    stock: "in",
  },
  {
    name: "Костюм бджоляра з євромаскою",
    category: "Захист",
    price: 1750,
    image: "suit",
    seller: "Пасіка Бортник",
    region: "Полтавська",
    stock: "in",
  },
  {
    name: "Вощина натуральна Дадан, 1 кг",
    category: "Вощина і рамки",
    price: 495,
    image: "frame",
    seller: "Апітех",
    region: "Київська",
    stock: "in",
  },
  {
    name: "Димар нержавіючий зі щитком",
    category: "Інвентар",
    price: 890,
    image: "smoker",
    seller: "Пасіка Бортник",
    region: "Полтавська",
    stock: "low",
  },
  {
    name: "Пилок бджолиний сушений, 500 г",
    category: "Мед і продукти",
    price: 690,
    image: "pollen",
    seller: "Пасіка Бортник",
    region: "Полтавська",
    stock: "in",
  },
];

export const products: Product[] = seed.map((item, index) => ({
  id: index + 1,
  name: item.name,
  category: item.category,
  price: item.price,
  seller: item.seller,
  region: item.region,
  rating: 4.5 + ((index + 1) % 6) / 10,
  reviews: 40 + (index + 1) * 37,
  image: `/products/${item.image}.svg`,
  stock: item.stock,
  description:
    "Якісний товар від перевіреного українського продавця. Підходить для щоденної роботи на пасіці.",
  reviewsList: [
    {
      id: 1,
      author: "Олександр К.",
      rating: 5,
      date: "12 червня 2026",
      text: "Товар відповідає опису, продавець швидко відправив. Якість хороша.",
      verified: true,
    },
    {
      id: 2,
      author: "Наталія П.",
      rating: 4,
      date: "28 травня 2026",
      text: "Все прийшло ціле. Хотілося б трохи швидше отримати консультацію.",
      verified: true,
    },
  ],
}));

export const getProduct = (id: string) =>
  products.find((product) => product.id === Number(id));
