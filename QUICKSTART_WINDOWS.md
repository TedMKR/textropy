# 🚀 Быстрый Старт Textropy (Windows 10)

## 📋 Предварительные требования

### Обязательно

- **Docker Desktop for Windows** (с WSL2 поддержкой)
- **Git** для клонирования репозитория

### Опционально (для локальной разработки)

- **Go 1.21+** - для разработки backend
- **Node.js 18+** - для разработки frontend

---

## 🐳 Запуск через Docker (Рекомендуется)

### Шаг 1: Проверьте Docker

```powershell
docker --version
docker compose version
```

Убедитесь, что Docker Desktop запущен.

### Шаг 2: Клонируйте проект (если еще не сделано)

```powershell
git clone https://github.com/yourusername/textropy.git
cd textropy
```

### Шаг 3: Создайте .env файлы (уже созданы)

Файлы `backend/.env` и `frontend/.env` уже настроены для локального запуска.

### Шаг 4: Запустите все сервисы

```powershell
docker compose up --build
```

**Первый запуск займет 5-10 минут** для загрузки образов и сборки.

### Шаг 5: Откройте приложение

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/health
- **Nginx**: http://localhost

### Остановка

```powershell
# Остановить (Ctrl+C в терминале)
# Или в новом окне PowerShell:
docker compose down
```

---

## 💻 Локальная Разработка (без Docker)

### Backend

#### 1. Установите Go

Скачайте с https://golang.org/dl/ и установите Go 1.21+

#### 2. Запустите Backend

```powershell
cd backend
go mod download
go run cmd/api/main.go
```

Backend будет доступен на http://localhost:8080

### Frontend

#### 1. Установите Node.js

Скачайте с https://nodejs.org/ и установите Node.js 18+

#### 2. Запустите Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend будет доступен на http://localhost:5173

---

## 🧪 Проверка Работы

### 1. Проверьте Backend

```powershell
# PowerShell
Invoke-WebRequest -Uri http://localhost:8080/health

# Или используйте curl (если установлен)
curl http://localhost:8080/health
```

Ожидаемый ответ:

```json
{
  "status": "ok",
  "message": "Textropy API is running"
}
```

### 2. Откройте Frontend

Перейдите в браузере на http://localhost:3000 (Docker) или http://localhost:5173 (локально)

### 3. Тест анализа

1. Создайте тестовый файл `test.txt` с текстом:
   ```
   Hello world! This is a test text for entropy analysis.
   Привет мир! Это тестовый текст для энтропийного анализа.
   ```

2. Загрузите файл через интерфейс (Drag & Drop или кнопка)

3. Дождитесь результатов анализа

---

## 🎨 Переключение Тем

В правом верхнем углу есть тройной переключатель:

- 🌞 **Светлая** - светлая тема с мятным фоном
- 💻 **Системная** - автоматический выбор по настройкам ОС
- 🌙 **Темная** - темная тема

---

## 🔧 Конфигурация API Переводчиков (Опционально)

Если хотите использовать настоящие API переводчиков:

### 1. Получите API ключи:

- **Yandex Translate**: https://cloud.yandex.ru/docs/translate/
- **Google Translate**: https://cloud.google.com/translate
- **DeepL**: https://www.deepl.com/pro-api

### 2. Обновите `backend/.env`:

```env
YANDEX_API_KEY=your_actual_yandex_key
GOOGLE_API_KEY=your_actual_google_key
DEEPL_API_KEY=your_actual_deepl_key
```

### 3. Перезапустите сервисы:

```powershell
docker compose restart backend
```

---

## 📦 Структура Проекта

```
textropy/
├── backend/                 # Go backend (Clean Architecture)
│   ├── cmd/api/            # Точка входа
│   ├── internal/           # Бизнес-логика
│   │   ├── domain/         # Доменный слой
│   │   ├── application/    # Слой приложения
│   │   ├── infrastructure/ # Инфраструктурный слой
│   │   └── presentation/   # Слой представления
│   └── pkg/                # Общие пакеты
├── frontend/               # React frontend
│   ├── src/
│   │   ├── features/       # Фичи (Upload, Analysis)
│   │   ├── shared/         # Общие компоненты
│   │   ├── store/          # Zustand state
│   │   └── theme/          # Система тем
│   └── public/
├── docker-compose.yml      # Docker оркестрация
└── nginx.conf             # Nginx конфигурация
```

---

## 🐛 Решение Проблем

### Docker не запускается

```powershell
# Проверьте статус Docker Desktop
# Убедитесь, что WSL2 включен
wsl --status

# Перезапустите Docker Desktop
```

### Порты заняты

Если порты 8080, 3000 или 80 уже используются:

```powershell
# Найдите процесс использующий порт
netstat -ano | findstr :8080

# Завершите процесс (замените PID)
taskkill /PID <process_id> /F

# Или измените порты в docker-compose.yml
```

### Frontend не подключается к Backend

1. Проверьте, что backend запущен: http://localhost:8080/health
2. Проверьте CORS настройки в `backend/.env`
3. Проверьте `VITE_API_URL` в `frontend/.env`

### Ошибка при сборке Go модулей

```powershell
cd backend
go clean -modcache
go mod download
```

### Ошибка при установке npm пакетов

```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install
```

---

## 📝 Команды Docker

```powershell
# Запуск всех сервисов
docker compose up

# Запуск в фоновом режиме
docker compose up -d

# Пересборка и запуск
docker compose up --build

# Остановка всех сервисов
docker compose down

# Остановка и удаление volumes
docker compose down -v

# Просмотр логов
docker compose logs

# Логи конкретного сервиса
docker compose logs backend
docker compose logs frontend

# Перезапуск сервиса
docker compose restart backend

# Запустить shell в контейнере
docker compose exec backend sh
docker compose exec frontend sh
```

---

## 🎯 Следующие Шаги

1. ✅ Протестируйте загрузку файлов
2. ✅ Попробуйте разные темы
3. ✅ Изучите результаты анализа (графики, таблицы)
4. 📚 Прочитайте полную документацию в `README.md`
5. 🏗️ Изучите архитектуру в `ARCHITECTURE.md`
6. 🚀 Посмотрите инструкции по развертыванию в `DEPLOYMENT.md`

---

## 💡 Полезные Ссылки

- **Документация**: README.md
- **Архитектура**: ARCHITECTURE.md
- **Развертывание**: DEPLOYMENT.md
- **Функции**: FEATURES.md

---

## 🤝 Поддержка

Если возникли проблемы:

1. Проверьте секцию "Решение Проблем" выше
2. Посмотрите логи: `docker compose logs`
3. Создайте issue на GitHub

---

**Приятного использования Textropy! 🎉**
