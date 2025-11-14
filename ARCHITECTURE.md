# Архитектура Textropy

## Обзор

Textropy - веб-приложение для энтропийного анализа текста с двойным переводом. Стек: **Go + React + TypeScript + Docker
**.

## Структура проекта

```
textropy/
├── backend/          # Go API
├── frontend/         # React UI
├── docker-compose.yml
└── nginx.conf
```

## Backend (Go)

### Слои архитектуры (Clean Architecture)

```
Presentation → Application → Domain → Infrastructure
```

#### 1. Domain Layer (`internal/domain/`)

**Бизнес-логика и сущности**

- `entities/` - основные сущности
    - `Text` - текст для анализа
    - `Analysis` - результат анализа (энтропия, статистика букв)
    - `TranslationResult` - результат полного цикла перевода
    - `LetterStat` - статистика по букве (частота, вклад в энтропию)

- `valueobjects/` - объекты-значения
    - `Language` - язык с алфавитом (ru, en, sw и др.)
    - `TranslatorType` - тип переводчика (yandex, google, deepl)

**Формулы:**

- Энтропия Шеннона: `H = -Σ(Pi × log₂(Pi))`
- Математическое ожидание: `χ = Σ(x × Pi)`
- Стандартное отклонение: `σ = √(Σ((x - χ)² × Pi))`

#### 2. Application Layer (`internal/application/`)

**Services** (`services/`)

- `TextAnalyzer` - анализ текста, подсчет статистики букв, расчет энтропии

**Use Cases** (`usecases/`)

- `AnalyzeTextUseCase` - простой анализ текста
- `TranslateAndAnalyzeUseCase` - полный цикл:
    1. Анализ оригинала
    2. Перевод на промежуточный язык
    3. Обратный перевод
    4. Анализ обратного перевода
    5. Сравнение метрик

#### 3. Infrastructure Layer (`internal/infrastructure/`)

- `translators/` - интеграции с API переводчиков
    - `TranslatorFactory` - создание переводчиков
    - `YandexTranslator` - Yandex Translate API
    - `Translator` interface

#### 4. Presentation Layer (`internal/presentation/`)

- `http/handlers/` - HTTP обработчики
    - `AnalysisHandler` - `/api/v1/analyze`
    - `TranslationHandler` - `/api/v1/translate-analyze`
    - `LanguageHandler` - `/api/v1/languages`

- `dto/` - Data Transfer Objects
    - Request/Response структуры для API

**Фреймворк:** Gin Web Framework  
**API:** RESTful JSON  
**Документация:** Swagger (доступна на `/swagger/index.html`)

### Основные эндпоинты

```
POST /api/v1/analyze              # Простой анализ
POST /api/v1/translate-analyze    # Полный цикл с переводом
GET  /api/v1/languages            # Список языков
GET  /health                      # Health check
```

## Frontend (React + TypeScript)

### Архитектура (Feature-Sliced Design)

```
src/
├── app/              # Конфигурация приложения
├── features/         # Фичи
│   ├── upload/       # Загрузка и настройка текста
│   └── analysis/     # Отображение результатов
├── shared/           # Общие компоненты
│   ├── api/          # API клиент (axios)
│   ├── ui/           # UI компоненты
│   └── utils/        # Утилиты
├── store/            # Состояние (Zustand)
└── theme/            # Темизация
```

### Ключевые компоненты

**Features:**

- `TextUploader` - форма загрузки текста, выбор языков, запуск анализа
- `TranslationComparisonResults` - результаты полного цикла с гистограммами
- `AnalysisResults` - результаты простого анализа

**Гистограммы (Recharts):**

1. Оригинал по алфавиту (зеленый)
2. Обратный перевод по алфавиту (красный)
3. Оригинал по возрастанию частоты (синий)
4. Обратный перевод по возрастанию частоты (красный)

**State Management:** Zustand (`analysisStore`)

- Текущий текст, выбранные языки
- Результаты анализа
- Состояние загрузки/ошибок

**UI Library:** Recharts (графики), Tailwind CSS (стили)

## Инфраструктура (Docker)

### Контейнеры

1. **backend** (порт 8080)
    - Go API
    - Gin framework
    - Yandex Translate API

2. **frontend** (порт 3000)
    - React dev server (Vite)
    - Горячая перезагрузка

3. **nginx** (порт 80)
    - Reverse proxy
    - Статические файлы
    - Роутинг запросов

### Сеть

```
nginx:80 ──┬──> backend:8080  (API /api/*)
           └──> frontend:3000  (UI /*)
```

### Переменные окружения

**Backend:**

```
YANDEX_API_KEY      # API ключ Yandex Translate
YANDEX_FOLDER_ID    # ID папки Yandex Cloud
GIN_MODE            # release/debug
CORS_ALLOWED_ORIGINS # Разрешенные источники
```

**Frontend:**

```
VITE_API_URL        # URL бэкенда (http://localhost:8080)
```

## Алгоритм анализа

### 1. Извлечение слов

- Разбивка текста на слова (разделители: пробелы, знаки)
- Подсчет первой буквы каждого слова

### 2. Расчет вероятностей

- `Pi = ni / N` где:
    - `ni` - количество слов на букву i
    - `N` - общее количество слов

### 3. Расчет энтропии

- `H = -Σ(Pi × log₂(Pi))` для всех букв с `Pi > 0`

### 4. Статистические характеристики

- Математическое ожидание (χ)
- Стандартное отклонение (σ)

### 5. Сравнение (при переводе)

- Потеря энтропии: `ΔH = H_обратно - H_оригинал`
- Изменения частот по каждой букве
- Топ-10 букв с наибольшими изменениями

## Безопасность

- CORS настроен для локальных доменов
- API ключи в переменных окружения
- Healthcheck для мониторинга
- Restart policy: `unless-stopped`

## Масштабирование

**Горизонтальное:**

- Backend: несколько инстансов за Nginx
- Stateless архитектура (без БД)

**Вертикальное:**

- Увеличение ресурсов контейнеров
- Оптимизация Go routines

## Зависимости

**Backend:**

- `gin-gonic/gin` - web framework
- `swaggo/swag` - Swagger документация
- `google/uuid` - генерация UUID

**Frontend:**

- `react` 18+ - UI библиотека
- `recharts` - графики
- `axios` - HTTP клиент
- `zustand` - state management
- `tailwindcss` - стили
- `vite` - сборщик

## Производительность

- **Анализ текста:** O(n) где n - количество слов
- **Перевод:** зависит от API (обычно 1-3 сек на запрос)
- **Полный цикл:** ~2-6 секунд (2 перевода + 3 анализа)

## Ограничения

- Максимальный размер текста: зависит от Yandex API (~10000 символов)
- Rate limit: зависит от тарифа Yandex Translate
- Поддерживаемые языки: определяются Yandex API
