$ErrorActionPreference = 'Stop'

function Read-File([string]$Path) {
  [System.IO.File]::ReadAllText((Resolve-Path -LiteralPath $Path), [System.Text.Encoding]::UTF8)
}
function Write-File([string]$Path, [string]$Text) {
  [System.IO.File]::WriteAllText((Resolve-Path -LiteralPath $Path), $Text, [System.Text.UTF8Encoding]::new($false))
}
function Save-Backup([string]$Path) {
  Copy-Item -LiteralPath $Path -Destination "$Path.before-fix.bak" -Force
}
function Replace-Required([string]$Path, [string]$Pattern, [string]$Replacement, [string]$What) {
  if (!(Test-Path -LiteralPath $Path)) { throw "Файл не знайдено: $Path" }
  $old = Read-File $Path
  $new = [regex]::Replace($old, $Pattern, $Replacement, 1)
  if ($new -eq $old) { throw "Не знайдено точну ділянку: $What" }
  Save-Backup $Path
  Write-File $Path $new
  Write-Host "OK: $What"
}

# 1) Верхній рядок Header: прибираємо тільки підписи двох верхніх посилань.
# У поточному GitHub вони є текстом, а не окремим Link-компонентом.
Replace-Required `
  'components/Header.tsx' `
  'Продавцям\s*　\s*Допомога' `
  '' `
  'верхні Продавцям і Допомога'

# Запасний варіант для версії, де між підписами стоять JSX-посилання.
$header = Read-File 'components/Header.tsx'
$header2 = [regex]::Replace($header, '(?s)<Link\s+href="/seller"[^>]*>\s*Продавцям\s*</Link>\s*<Link\s+href="/help"[^>]*>\s*Допомога\s*</Link>', '')
if ($header2 -ne $header) { Save-Backup 'components/Header.tsx'; Write-File 'components/Header.tsx' $header2; Write-Host 'OK: верхні Link-посилання' }

# 2) AppState: саме тут поточний GitHub блокує додавання через canBuy/status.
# Прибираємо тільки цей блокувальник, видалений товар як і раніше не додається.
Replace-Required `
  'components/AppState.tsx' `
  'if\s*\(\s*isRemoved\(product\.id\)\s*\|\|\s*!canBuy\(statusOf\(product\)\)\s*\)\s*\{' `
  'if (isRemoved(product.id)) {' `
  'розблокування додавання в кошик'

# 3) Сторінка товару: кнопка і +/- не блокуються статусом, totalPrice вже рахується як price * quantity.
Replace-Required `
  'app/product/[id]/page.tsx' `
  'const buyable\s*=\s*canBuy\(status\);' `
  'const buyable = true;' `
  'доступність кількості і кнопки кошика'

# Прибираємо тепер непотрібний імпорт canBuy, не чіпаючи решту імпортів.
$product = Read-File 'app/product/[id]/page.tsx'
$product2 = [regex]::Replace($product, '(?m)^\s*canBuy,\r?\n', '')
if ($product2 -ne $product) { Write-File 'app/product/[id]/page.tsx' $product2; Write-Host 'OK: зайвий імпорт після правки' }

# 4) Коментар: success-повідомлення без «на перевірку».
Replace-Required `
  'app/product/[id]/page.tsx' `
  'Дякуємо, відгук відправлено на перевірку\.' `
  'Дякуємо, відгук відправлено.' `
  'звичайна відправка коментаря'

Write-Host ''
Write-Host 'Готово. Змінено тільки Header.tsx, AppState.tsx і сторінку товару.'
Write-Host 'Резервні копії створено поруч із зміненими файлами як *.before-fix.bak.'
