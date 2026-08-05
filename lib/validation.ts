export const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Zа-яА-Я]{2,}$/;
export const phonePattern = /^\+?\d[\d\s()-]{8,17}$/;

export const isEmail = (value: string) => emailPattern.test(value.trim());
export const isPhone = (value: string) => phonePattern.test(value.trim());
export const isContact = (value: string) => isEmail(value) || isPhone(value);

export function validateName(value: string) {
  if (!value.trim()) return "Вкажіть, як до вас звертатися";
  if (value.trim().length < 2) return "Замало символів для імені";
  return "";
}

export function validateContact(value: string) {
  if (!value.trim()) return "Потрібен телефон або email для відповіді";
  if (!isContact(value)) return "Схоже на помилку: перевірте телефон або email";
  return "";
}

export function validateEmail(value: string) {
  if (!value.trim()) return "Вкажіть email для відповіді";
  if (!isEmail(value)) return "Некоректний email";
  return "";
}

export function validateText(value: string, min = 10) {
  if (!value.trim()) return "Опишіть питання";
  if (value.trim().length < min) return `Мінімум ${min} символів, зараз ${value.trim().length}`;
  return "";
}
