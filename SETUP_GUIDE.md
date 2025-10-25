# 🚀 Руководство по Настройке Textropy

## 📋 Содержание

1. [Быстрый старт](#быстрый-старт)
2. [Получение API ключа Yandex Translate](#получение-api-ключа-yandex-translate)
3. [Настройка Backend](#настройка-backend)
4. [Настройка Frontend](#настройка-frontend)
5. [Запуск приложения](#запуск-приложения)
6. [Тестирование](#тестирование)

---

## Быстрый старт

### Вариант 1: Docker (Рекомендуется)

```bash
# Клонирование репозитория
git clone <repository-url>
cd textropy

# Настройка переменных окружения
cp backend/.env.example backend/.env
# Отредактируйте backend/.env и добавьте API ключи

# Запуск
docker-compose up --build
```

### Вариант 2: Локальная разработка

**Требования:**

- Go 1.21+
- Node.js 18+
- npm или yarn

---

## Получение API ключа Yandex Translate

### Шаг 1: Регистрация в Yandex Cloud

1. Перейдите на [Yandex Cloud](https://cloud.yandex.ru/)
2. Нажмите **"Войти"** или **"Зарегистрироваться"**
3. Войдите через Yandex ID (или создайте новый аккаунт)

### Шаг 2: Создание платежного аккаунта

1. После входа перейдите в **"Биллинг"**
2. Нажмите **"Создать платежный аккаунт"**
3. Выберите тип аккаунта: **"Физическое лицо"** или **"Организация"**
4. Заполните данные (ИНН, адрес)
5. Подтвердите создание

> ⚠️ **Важно**: Yandex Cloud предоставляет **бесплатный триал** с грантом на 4000₽. API Translate стоит ~1₽ за 1 млн
> символов.

### Шаг 3: Включение Yandex Translate API

1. В консоли Yandex Cloud перейдите в **"Каталог"** → **"Сервисы"**
2. Найдите **"Translate"** и нажмите **"Подключить"**
3. Создайте сервисный аккаунт:
    - Перейдите в **"Сервисные аккаунты"**
    - Нажмите **"Создать сервисный аккаунт"**
    - Имя: `textropy-translator`
    - Роль: `translate.user`

### Шаг 4: Создание API ключа

1. Откройте созданный сервисный аккаунт
2. Перейдите на вкладку **"API-ключи"**
3. Нажмите **"Создать API-ключ"**
4. **Скопируйте ключ** (он показывается только один раз!)
5. Формат ключа: `AQVNxxxxx...`

### Шаг 5: Получение Folder ID

**Важно!** Yandex Translate API требует не только API-ключ, но и **Folder ID** (идентификатор каталога).

1. В консоли Yandex Cloud перейдите на главную страницу
2. Выберите ваш **каталог** (например, "default")
3. **Скопируйте Folder ID** из адресной строки или верхней панели
4. Формат Folder ID: `b1gxxxxxxxxxxxxxxxxxx`

**Альтернативный способ:**

- Перейдите: https://console.yandex.cloud
- В выпадающем списке каталогов наведите на нужный каталог
- ID каталога будет показан рядом с названием

### Шаг 6: Добавление ключей в проект

```bash
cd backend
cp .env.example .env
nano .env  # или любой другой редактор
```

Вставьте ваши API ключ **И Folder ID**:

```env
YANDEX_API_KEY=AQVNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
YANDEX_FOLDER_ID=b1gxxxxxxxxxxxxxxxxxx
```

---

## Настройка Backend

### 1. Установка зависимостей

```bash
cd backend
go mod download
```

### 2. Настройка .env

```bash
cp .env.example .env
```

Отредактируйте `backend/.env`:

```env
# Server
PORT=8080
GIN_MODE=debug

# Yandex Translate (обязательно для полного цикла перевода)
YANDEX_API_KEY=<ваш_ключ_yandex>
YANDEX_FOLDER_ID=<ваш_folder_id>

# Google Translate (опционально)
GOOGLE_API_KEY=

# DeepL (опционально)
DEEPL_API_KEY=

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost
```

### 3. Запуск Backend

```bash
go run cmd/api/main.go
```

Сервер запустится на `http://localhost:8080`

---

## Настройка Frontend

### 1. Установка зависимостей

```bash
cd frontend
npm install
```

### 2. Настройка .env

```bash
cp .env.example .env
```

Отредактируйте `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=Textropy
VITE_APP_VERSION=1.0.0
```

### 3. Запуск Frontend

```bash
npm run dev
```

Приложение откроется на `http://localhost:5173`

---

## Запуск приложения

### Docker Compose (рекомендуется)

```bash
docker-compose up --build
```

Доступ:

- Frontend: http://localhost
- Backend API: http://localhost:8080
- Swagger: http://localhost:8080/swagger/index.html

### Локальная разработка

**Терминал 1 (Backend):**

```bash
cd backend
go run cmd/api/main.go
```

**Терминал 2 (Frontend):**

```bash
cd frontend
npm run dev
```

---

## Тестирование

### Тест 1: Проверка API

```bash
# Health check
curl http://localhost:8080/health

# Простой анализ
curl -X POST http://localhost:8080/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"content": "Я люблю когда шумят берёзы", "language": "ru"}'
```

### Тест 2: Полный цикл перевода (требуется API ключ)

```bash
curl -X POST http://localhost:8080/api/v1/translate-analyze \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Я люблю когда шумят берёзы. Когда листья падают с берёз.",
    "source_language": "ru",
    "target_language": "sw",
    "translator": "yandex"
  }'
```

### Тест 3: Через UI

1. Откройте http://localhost:5173
2. Вставьте текст стихотворения "Березы":

```
Я люблю, когда шумят берёзы,
Когда листья падают с берёз.
Слушаю – и набегают слёзы
На глаза, отвыкшие от слёз.
```

3. Выберите переводчик: **Yandex Translate**
4. Выберите промежуточный язык: **Суахили**
5. Нажмите **"Полный цикл перевода и анализа"**
6. Изучите результаты сравнения энтропий

---

## Troubleshooting

### Ошибка: "API key is missing"

**Решение:**

1. Проверьте, что в `backend/.env` указан `YANDEX_API_KEY`
2. Перезапустите backend

### Ошибка: "translation failed"

**Возможные причины:**

1. **Неверный API ключ** - проверьте ключ в Yandex Cloud
2. **Закончился грант** - проверьте баланс в биллинге
3. **Превышен лимит** - Yandex ограничивает 20 запросов/сек

**Решение:**

- Проверьте логи backend: `docker-compose logs backend`
- Убедитесь, что API ключ активен

### Порты заняты

**Решение:**

```bash
# Изменить порты в docker-compose.yml
services:
  frontend:
    ports:
      - "3000:80"  # вместо 80:80
```

---

## Дополнительные возможности

### Swagger API Documentation

После запуска backend, откройте:

```
http://localhost:8080/swagger/index.html
```

### Поддерживаемые языки

- **Исходный язык**: Русский (ru), Английский (en)
- **Промежуточный язык**: Суахили (sw), Английский (en)

### Добавление новых языков

См. руководство в [ARCHITECTURE.md](ARCHITECTURE.md) - раздел "Добавление нового языка"

---

## Контакты и Поддержка

- 📚 [Документация](README.md)
- 🏗️ [Архитектура](ARCHITECTURE.md)
- 🐛 [Issues](issues)

---

**Удачного использования Textropy! 🎉**
