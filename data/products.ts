export type Review = {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
};

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
  stock: "in" | "low" | "pre";
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

const names = [
  "Вулик Дадан на 10 рамок, липа",
  "Медогонка 4-рамкова, нержавійка 304",
  "Матка карпатка плідна F1, сезон 2026",
  "Мед соняшниковий урожай 2026, 3 л",
  "Костюм бджоляра з євромаскою",
  "Вощина натуральна Дадан, 1 кг",
  "Димар нержавіючий зі щитком",
  "Пилок бджолиний сушений, 500 г",
];

const prices = [4850, 12300, 620, 780, 1750, 495, 890, 690];
const images = ["hive", "extractor", "queen", "jar", "suit", "frame", "smoker", "pollen"];

export const products: Product[] = names.map((name, index) => ({
  id: index + 1,
  name,
  category: [
  "Вулики",
  "Інвентар",
  "Матки та бджолопакети",
  "Мед і продукти",
  "Захист",
  "Вощина і рамки",
  "Захист",
  "Мед і продукти",
][index],
  price: prices[index],
  seller: ["Пасіка Бортник", "Апітех", "Розплідник Гуцул", "Пасіка Сонцедар"][index % 4],
  region: ["Полтавська", "Київська", "Закарпатська", "Херсонська"][index % 4],
  rating: 4.5 + ((index + 1) % 6) / 10,
  reviews: 40 + (index + 1) * 37,
  image: `/products/${images[index]}.svg`,
  stock: index === 2 ? "pre" : index === 1 || index === 6 ? "low" : "in",
  description: "Якісний товар від перевіреного українського продавця. Підходить для щоденної роботи на пасіці.",
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

export const getProduct = (id: string) => products.find((product) => product.id === Number(id));
