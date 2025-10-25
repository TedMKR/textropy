# 🏗️ Архитектура Textropy

## Содержание

1. [Обзор](#обзор)
2. [Архитектурные Принципы](#архитектурные-принципы)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Data Flow](#data-flow)
6. [Design Patterns](#design-patterns)

---

## Обзор

Textropy построен на основе **Clean Architecture** с применением принципов **Domain-Driven Design (DDD)** и **SOLID**.
Архитектура обеспечивает:

- ✅ Независимость от фреймворков
- ✅ Тестируемость
- ✅ Независимость от UI
- ✅ Независимость от баз данных
- ✅ Независимость от внешних сервисов

---

## Архитектурные Принципы

### SOLID Principles

#### 1. Single Responsibility Principle (SRP)

Каждый модуль отвечает только за одну задачу:

- `TextAnalyzer` - только анализ текста
- `TranslatorService` - только перевод
- `AnalysisHandler` - только обработка HTTP запросов

#### 2. Open/Closed Principle (OCP)

Система открыта для расширения, но закрыта для модификации:

- Новые переводчики добавляются без изменения существующего кода
- `Translator` interface позволяет легко добавлять провайдеров

#### 3. Liskov Substitution Principle (LSP)

Все реализации `Translator` взаимозаменяемы:

```go
var translator Translator
translator = NewYandexTranslator(key)  // ✅
translator = NewGoogleTranslator(key)  // ✅
translator = NewDeepLTranslator(key)   // ✅
```

#### 4. Interface Segregation Principle (ISP)

Интерфейсы разделены по функциональности:

- `Translator` - только перевод
- `AnalysisRepository` - только работа с данными
- Никаких "толстых" интерфейсов

#### 5. Dependency Inversion Principle (DIP)

Зависимости направлены на абстракции:

```go
// ✅ Правильно: зависимость от интерфейса
type AnalyzeTextUseCase struct {
    analyzer   services.TextAnalyzer
    repository repositories.AnalysisRepository // интерфейс
}

// ❌ Неправильно: зависимость от конкретной реализации
type AnalyzeTextUseCase struct {
    analyzer   services.TextAnalyzer
    repository *PostgresRepository // конкретная реализация
}
```

### GRASP Principles

#### Information Expert

Каждый объект содержит логику, связанную с его данными:

- `Text.Validate()` - валидация внутри entity
- `Analysis.CalculateEntropy()` - расчет энтропии там, где данные

#### Low Coupling

Минимальная зависимость между модулями:

- Presentation Layer не знает о Domain
- Infrastructure не влияет на Business Logic

#### High Cohesion

Модули связаны логически и выполняют одну задачу:

- `features/upload/` - всё для загрузки
- `features/analysis/` - всё для анализа

---

## Backend Architecture

### Слои приложения (Clean Architecture)

```
┌───────────────────────────────────────────────────────┐
│          Presentation Layer (HTTP)                    │
│  handlers/, middleware/, routes.go, dto/              │
│  ↓ Зависимость                                        │
│          Application Layer                            │
│  usecases/, services/                                 │
│  ↓ Зависимость                                        │
│          Domain Layer (Core)                          │
│  entities/, valueobjects/, repositories/ (interfaces) │
│  ↑ Реализуют интерфейсы                               │
│          Infrastructure Layer                         │
│  translators/, persistence/, cache/                   │
└───────────────────────────────────────────────────────┘
```

### 1. Domain Layer (Ядро)

**Отвечает за**: Бизнес-логику и правила предметной области

**Содержит**:

- **Entities**: `Text`, `Analysis` - объекты с идентичностью
- **Value Objects**: `Language`, `TranslatorType` - иммутабельные объекты без идентичности
- **Repository Interfaces**: Абстракции для хранения данных

**Пример Entity**:

```go
type Text struct {
    ID       uuid.UUID
    Content  string
    Language Language
    WordCount int
}

func (t *Text) Validate() error {
    if t.Content == "" {
        return ErrEmptyContent
    }
    return nil
}
```

**Правила**:

- ❌ НЕТ зависимостей от других слоев
- ✅ Чистый Go код
- ✅ Содержит бизнес-логику

### 2. Application Layer

**Отвечает за**: Оркестрацию бизнес-процессов

**Содержит**:

- **Use Cases**: `AnalyzeTextUseCase` - сценарии использования
- **Services**: `TextAnalyzer`, `TranslatorService` - прикладные сервисы

**Пример Use Case**:

```go
type AnalyzeTextUseCase struct {
    analyzer   *services.TextAnalyzer
    repository repositories.AnalysisRepository
}

func (uc *AnalyzeTextUseCase) Execute(ctx context.Context, text *entities.Text) (*entities.Analysis, error) {
    // 1. Валидация
    if err := text.Validate(); err != nil {
        return nil, err
    }
    
    // 2. Бизнес-логика
    analysis := uc.analyzer.Analyze(text)
    
    // 3. Сохранение (если нужно)
    if uc.repository != nil {
        uc.repository.Save(ctx, analysis)
    }
    
    return analysis, nil
}
```

**Правила**:

- ✅ Зависит только от Domain Layer
- ✅ Координирует работу Services
- ❌ НЕ знает об HTTP, БД и т.д.

### 3. Infrastructure Layer

**Отвечает за**: Интеграцию с внешними сервисами

**Содержит**:

- **Translators**: Реал��зации для Yandex, Google, DeepL
- **Persistence**: Работа с БД (SQLite, PostgreSQL)
- **Cache**: Redis, in-memory кэш

**Пример Translator**:

```go
type YandexTranslator struct {
    apiKey     string
    httpClient *http.Client
}

func (y *YandexTranslator) Translate(ctx context.Context, text string, targetLang valueobjects.Language) (string, error) {
    // Вызов Yandex API
}
```

**Правила**:

- ✅ Реализует интерфейсы из Domain
- ✅ Может иметь внешние зависимости
- ❌ НЕ влияет на бизнес-логику

### 4. Presentation Layer

**Отвечает за**: Обработку HTTP запросов

**Содержит**:

- **Handlers**: Обработчики endpoints
- **DTOs**: Объекты передачи данных
- **Middleware**: CORS, логирование, аутентификация

**Пример Handler**:

```go
func (h *AnalysisHandler) AnalyzeText(c *gin.Context) {
    var req dto.AnalyzeRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    
    // Преобразование DTO -> Entity
    text := req.ToEntity()
    
    // Вызов Use Case
    result, err := h.useCase.Execute(c.Request.Context(), text)
    
    // Преобразование Entity -> DTO
    response := dto.FromAnalysis(result)
    c.JSON(200, response)
}
```

---

## Frontend Architecture

### Структура (Feature-Sliced Design)

```
src/
├── app/                    # Инициализация приложения
├── features/               # Фичи по доменам
│   ├── upload/            # Загрузка текста
│   │   └── TextUploader.tsx
│   ├── analysis/          # Анализ и результаты
│   │   └── AnalysisResults.tsx
│   └── settings/          # Настройки
├── shared/                # Переиспользуемые компоненты
│   ├── ui/               # UI Kit
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ThemeSwitch.tsx
│   ├── api/              # API клиент
│   └── hooks/            # Custom hooks
├── store/                # Глобальное состояние (Zustand)
└── theme/                # Система тем
```

### State Management (Zustand)

```typescript
// store/analysisStore.ts
interface AnalysisStore {
  currentResult: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  
  analyzeText: (content: string, options: AnalysisOptions) => Promise<void>;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  currentResult: null,
  isAnalyzing: false,
  error: null,
  
  analyzeText: async (content, options) => {
    set({ isAnalyzing: true, error: null });
    try {
      const result = await api.analyze(content, options);
      set({ currentResult: result, isAnalyzing: false });
    } catch (error) {
      set({ error: error.message, isAnalyzing: false });
    }
  },
  
  reset: () => set({ currentResult: null, error: null }),
}));
```

### Component Patterns

#### 1. Feature Component

```typescript
// features/upload/TextUploader.tsx
export const TextUploader: React.FC = () => {
  const { analyzeText } = useAnalysisStore();
  
  const handleUpload = async (file: File) => {
    const content = await readFile(file);
    await analyzeText(content, { language: 'russian' });
  };
  
  return <UploadZone onUpload={handleUpload} />;
};
```

#### 2. UI Component (Reusable)

```typescript
// shared/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', ...props }) => {
  return <button className={styles[variant]} {...props} />;
};
```

---

## Data Flow

### Request Flow (Backend)

```
1. HTTP Request
   ↓
2. Gin Router (routes.go)
   ↓
3. Middleware (CORS, Logger)
   ↓
4. Handler (AnalysisHandler)
   ↓ Преобразование DTO → Entity
5. Use Case (AnalyzeTextUseCase)
   ↓ Бизнес-логика
6. Service (TextAnalyzer)
   ↓ Расчет энтропии
7. Entity (Analysis)
   ↓ Результат
8. Handler (Преобразование Entity → DTO)
   ↓
9. JSON Response
```

### Data Flow (Frontend)

```
1. User Action (Upload File)
   ↓
2. Component (TextUploader)
   ↓
3. Store Action (analyzeText)
   ↓
4. API Client (axios)
   ↓
5. Backend Request
   ↓
6. Response Handling
   ↓
7. Store Update (set state)
   ↓
8. Component Re-render (AnalysisResults)
```

---

## Design Patterns

### 1. Repository Pattern

Абстракция доступа к данным:

```go
type AnalysisRepository interface {
    Save(ctx context.Context, analysis *entities.Analysis) error
    FindByID(ctx context.Context, id uuid.UUID) (*entities.Analysis, error)
}

// Реализация может быть PostgreSQL, SQLite, In-Memory
type PostgresRepository struct { /* ... */ }
```

### 2. Factory Pattern

Создание переводчиков:

```go
type TranslatorFactory struct {
    yandexKey string
    googleKey string
}

func (f *TranslatorFactory) Create(translatorType valueobjects.TranslatorType) (Translator, error) {
    switch translatorType {
    case valueobjects.YandexTranslator:
        return NewYandexTranslator(f.yandexKey), nil
    // ...
    }
}
```

### 3. Strategy Pattern

Выбор переводчика во время выполнения:

```go
var translator Translator
translator = factory.Create(userSelectedType)
translated := translator.Translate(text, targetLang)
```

### 4. Dependency Injection

Внедрение зависимостей:

```go
// main.go
analyzer := services.NewTextAnalyzer()
useCase := usecases.NewAnalyzeTextUseCase(analyzer, repository)
handler := handlers.NewAnalysisHandler(useCase)
```

### 5. Observer Pattern (Frontend)

Подписка на изменения состояния:

```typescript
// Компоненты автоматически обновляются при изменении store
const { currentResult } = useAnalysisStore();
```

---

## Преимущества Архитектуры

### 1. Тестируемость

```go
// Легко мокировать интерфейсы
type MockRepository struct {}
func (m *MockRepository) Save(ctx, analysis) error { return nil }

// Тест Use Case
repo := &MockRepository{}
useCase := NewAnalyzeTextUseCase(analyzer, repo)
```

### 2. Гибкость

- Замена Yandex на Google Translate - без изменения бизнес-логики
- Переход с SQLite на PostgreSQL - только Infrastructure Layer
- Смена Gin на другой фреймворк - только Presentation Layer

### 3. Масштабируемость

- Легко добавить новые фичи
- Микросервисная архитектура возможна в будущем
- Горизонтальное масштабирование backend

### 4. Поддерживаемость

- Четкое разделение ответственности
- Документированный код
- Понятная структура для новых разработчиков

---

## Рекомендации по Расширению

### Добавление нового переводчика

1. Создать файл `backend/internal/infrastructure/translators/microsoft.go`
2. Реализовать интерфейс `Translator`
3. Добавить в `TranslatorFactory.Create()`
4. Обновить `valueobjects.TranslatorType`

### Добавление новой фичи анализа

1. Создать entity в `domain/entities/`
2. Создать service в `application/services/`
3. Создать use case в `application/usecases/`
4. Создать handler в `presentation/http/handlers/`
5. Добавить route в `routes.go`

### Добавление базы данных

1. Создать implementation в `infrastructure/persistence/postgres/`
2. Реализовать интерфейсы из `domain/repositories/`
3. Внедрить через DI в `main.go`

---

## 🎓 Заключение

Архитектура Textropy демонстрирует применение лучших практик разработки ПО:

- ✅ Clean Architecture
- ✅ Domain-Driven Design
- ✅ SOLID Principles
- ✅ GRASP Principles
- ✅ Design Patterns

Это обеспечивает качество кода, тестируемость и простоту поддержки.
