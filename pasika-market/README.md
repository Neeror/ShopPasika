# ShopPasika final frontend fix

Патч працює поверх поточного `main` з GitHub, читає файли повністю і не обрізає їх.

Він змінює тільки:

- верхній службовий рядок: прибирає `Продавцям` і `Допомога`; нижній футер не чіпає;
- `components/AppState.tsx`: дозволяє додавати товар у кошик;
- сторінку товару: кількість, `ціна × кількість`, коментар без «на перевірку»;
- `components/SupportChat.tsx`: повний чат із textarea, історією, відправленням і збереженням;
- `app/messages/page.tsx`: робоча історія чатів без зламаного типу.

Запуск у корені репозиторію:

```powershell
powershell -ExecutionPolicy Bypass -File .\apply-fix.ps1
npm run typecheck
npm run build
```

Перед кожним зміненим файлом створюється резервна копія `*.before-shop-pasika-fix.bak`.
