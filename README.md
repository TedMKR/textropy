# 📊 Textropy - Система Энтропийного Анализа Текста

<div align="center">

![Textropy Logo](https://img.shields.io/badge/Textropy-00A779?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkgMTlWMTNBMiAyIDAgMCAwIDcgMTFINUEyIDIgMCAwIDAgMyAxM1YxOUEyIDIgMCAwIDAgNSAyMUg3QTIgMiAwIDAgMCA5IDE5Wk05IDE5VjlBMiAyIDAgMCAxIDExIDdIMTNBMiAyIDAgMCAxIDE1IDlWMTlNOSAxOUEyIDIgMCAwIDAgMTEgMjFIMTNBMiAyIDAgMCAwIDE1IDE5TTE1IDE5VjVBMiAyIDAgMCAxIDE3IDNIMTLBMIBBMCAWIDAGMCAXIDE1IDE5QTIgMiAwIDAgMSAxOSAyMUgxOUEyIDIgMCAwIDEgMTUgMTlaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=)

[![Go Version](https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat-square&logo=go)](https://golang.org/)
[![React Version](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

**Веб-приложение для энтропийного анализа текста по алгоритму Шеннона**

[Демо](#) • [Документация](DEPLOYMENT.md) • [API Docs](http://localhost:8080/swagger/index.html)

</div>

---

## 🎯 Описание

**Textropy** - это современная веб-платформа для анализа энтропии текстов с использованием формулы Шеннона. Приложение
предоставляет интуитивный интерфейс для загрузки документов, выбора параметров анализа и визуализации результатов.

### Ключевые возможности

- 📝 **Загрузка текстовых документов** - поддержка .txt, .doc, .docx форматов
- 📊 **Энтропийный анализ** - расчет по формуле Шеннона: `H = -Σ(Pᵢ × log₂(Pᵢ))`
- 🌐 **Мультиязычный перевод** - интеграция с Yandex
- 🔄 **Полный цикл перевода** - перевод вперед + обратный перевод + сравнение энтропий
- 📈 **Визуализация данных** - графики распределения букв, таблицы статистики
- 📉 **Анализ информационных потерь** - измерение потерь при переводе
- 🎨 **Адаптивный дизайн** - светлая/темная/системная тема
- ⚡ **Высокая производительность** - Go backend + React frontend

---

## 🚀 Быстрый Старт

### Вариант 1: Docker (рекомендуется)

```bash
# Клонирование репозитория
git clone <repository-url>
cd textropy

# Запуск всего стека
docker-compose up --build

# Приложение доступно по адресу:
# Frontend: http://localhost
# Backend: http://localhost:8080
# Swagger: http://localhost:8080/swagger/index.html
```


---

## 🏗️ Архитектура

Проект построен на принципах **Clean Architecture**, **DDD** и **SOLID**.

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                   │
│  ┌──────────────────────────────────────────────┐  │
│  │  Features: Upload, Analysis, Settings        │  │
│  │  State: Zustand                              │  │
│  │  UI: Tailwind CSS + Custom Components       │  │
│  │  Theme: Light / Dark / System (Triple)      │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────┘
                     │ HTTP/REST API
┌────────────────────▼────────────────────────────────┐
│                Backend (Go + Gin)                    │
│  ┌──────────────────────────────────────────────┐  │
│  │ Presentation Layer                           │  │
│  │  - HTTP Handlers                             │  │
│  │  - DTOs, Middleware                          │  │
│  └────────────────┬─────────────────────────────┘  │
│                   │                                  │
│  ┌────────────────▼─────────────────────────────┐  │
│  │ Application Layer                            │  │
│  │  - Use Cases (AnalyzeTextUseCase)           │  │
│  │  - Services (TextAnalyzer)                   │  │
│  └────────────────┬─────────────────────────────┘  │
│                   │                                  │
│  ┌────────────────▼─────────────────────────────┐  │
│  │ Domain Layer                                 │  │
│  │  - Entities (Text, Analysis)                 │  │
│  │  - Value Objects (Language, TranslatorType) │  │
│  │  - Repository Interfaces                     │  │
│  └────────────────┬─────────────────────────────┘  │
│                   │                                  │
│  ┌────────────────▼─────────────────────────────┐  │
│  │ Infrastructure Layer                         │  │
│  │  - Translators (Yandex, Google, DeepL)      │  │
│  │  - Cache, Persistence                        │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 📊 API Документация

### Основные эндпоинты

#### POST `/api/v1/analyze`

Простой анализ текста (без перевода)

**Request:**
```json
{
  "content": "Текст для анализа...",
  "language": "ru"
}
```

#### POST `/api/v1/translate-analyze`

**Полный цикл перевода и анализа** ⭐ NEW

**Request:**
```json
{
  "content": "Я люблю, когда шумят берёзы...",
  "source_language": "ru",
  "target_language": "sw",
  "translator": "yandex"
}
```

**Response:**
```json
{
  "id": "uuid",
  "original_text": "Я люблю, когда шумят берёзы...",
  "original_analysis": {
    "entropy": 4.116,
    "total_words": 106,
    "mean": 14.79,
    "std_dev": 4.37
  },
  "translated_text": "I upendo ni wakati...",
  "translated_analysis": {
    "entropy": 3.847,
    ...
  },
  "back_translated_text": "Я люблю это время...",
  "back_translated_analysis": {
    "entropy": 3.925,
    ...
  },
  "comparison": {
    "entropy_loss": 0.191,
    "entropy_loss_percent": 4.63,
    "letter_freq_changes": {
      ...
    }
  }
}
```

Полная документация: [http://localhost:8080/swagger/index.html](http://localhost:8080/swagger/index.html)

---


## 📁 Структура Проекта

```
textropy/
├── backend/                    # Go backend
│   ├── cmd/api/               # Точка входа
│   ├── internal/
│   │   ├── domain/            # Domain Layer (DDD)
│   │   ├── application/       # Use Cases, Services
│   │   ├── infrastructure/    # External dependencies
│   │   └── presentation/      # HTTP handlers, DTOs
│   └── pkg/                   # Shared utilities
│       ├── config/
│       └── logger/
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── app/               # App setup
│   │   ├── features/          # Feature modules
│   │   │   ├── upload/
│   │   │   ├── analysis/
│   │   │   └── settings/
│   │   ├── shared/            # Shared components
│   │   │   ├── ui/
│   │   │   ├── api/
│   │   │   └── utils/
│   │   ├── store/             # Zustand store
│   │   └── theme/             # Theme provider
│   └── public/
├── docker-compose.yml
├── nginx.conf
└── README.md
```
---

<div align="center">

**Сделано с ❤️ используя Go, React и TypeScript**

[⬆ Вернуться наверх](#-textropy---система-энтропийного-анализа-текста)

</div>

