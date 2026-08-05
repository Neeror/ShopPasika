# ShopPasika exact fix

Цей патч працює поверх поточного коду з GitHub і **не обрізає файли**. Він:

- прибирає тільки `Продавцям` і `Допомога` з верхнього службового рядка;
- прибирає блокування `canBuy/status` у `AppState`, через яке товар не додавався в кошик;
- залишає кількість, `totalPrice = price * quantity`, +/- і підсумок кошика робочими;
- прибирає текст «відправлено на перевірку» з коментаря;
- змінює тільки `components/Header.tsx`, `components/AppState.tsx`, `app/product/[id]/page.tsx`;
- перед кожною зміною робить резервну копію `*.before-fix.bak`.

Запуск у корені репозиторію:

```powershell
powershell -ExecutionPolicy Bypass -File .\apply-fix.ps1
npm run typecheck
npm run build
```

Якщо структура файлів не збігається, скрипт зупиниться і нічого не змінить далі.
