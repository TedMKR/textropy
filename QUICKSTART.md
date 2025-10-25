# 🚀 Быстрый Старт Textropy

## Запуск Backend (Go)

```bash
# Перейти в директорию backend
cd backend

# Установить зависимости
go mod download

# Запустить сервер
go run cmd/api/main.go
```

Backend будет доступен на `http://localhost:8080`

### Проверка работы API

```bash
# Health check
curl http://localhost:8080/health

# Пример анализа текста
curl -X POST http://localhost:8080/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Я люблю, когда шумят берёзы, Когда листья падают с берёз.",
    "language": "ru"
  }'
```

## Запуск Frontend (React)

```bash
# Перейти в директорию frontend
cd frontend

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev
```

Frontend будет доступен на `http://localhost:5173`

## Запуск с Docker Compose

```bash
# Из корневой директории проекта
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

Приложение будет доступно:

- Frontend: `http://localhost` (через Nginx)
- Backend API: `http://localhost:8080`

## Цветовая схема

- **Основной цвет страниц**: `#F5FFFA` (Mint Cream)
- **Цвет элементов интерфейса**: `#00A779` (Зеленый)

## Функционал

### ✅ Backend

- ✅ Энтропийный анализ по алгоритму Шеннона
- ✅ Подсчет статистических показателей (H, χ, σ)
- ✅ Поддержка русского и английского языков
- ✅ Clean Architecture + DDD
- ✅ RESTful API
- ✅ CORS поддержка

### ✅ Frontend

- ✅ Загрузка текста (ввод или файл)
- ✅ Выбор языка (ru/en)
- ✅ Выбор переводчика (Yandex/Google/DeepL)
- ✅ **Тройной переключатель темы** (System/Light/Dark)
- ✅ Интерактивные графики (Recharts)
- ✅ Детальная статистика по буквам
- ✅ Responsive дизайн

## Примеры использования

### Анализ стихотворения Н. Рубцова

```
Я люблю, когда шумят берёзы,
Когда листья падают с берёз.
Слушаю – и набегают слёзы
На глаза, отвыкшие от слёз.
```

**Ожидаемые результаты:**

- H (энтропия) ≈ 4.116
- N (слов) = 20
- χ (мат. ожидание) ≈ 14.79
- σ (станд. откл.) ≈ 4.37

## Устранение проблем

### Backend не запускается

```bash
# Убедитесь что порт 8080 свободен
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # Linux/Mac

# Переустановите зависимости
cd backend
go mod tidy
go mod download
```

### Frontend не собирается

```bash
# Очистите node_modules и переустановите
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### CORS ошибки

Убедитесь, что backend запущен и CORS middleware настроен правильно.
Frontend должен проксировать запросы через Vite proxy (уже настроено).

## Следующие шаги

1. ⚡ Протестируйте на разных текстах
2. 🎨 Попробуйте все три темы
3. 📊 Изучите графики и статистику
4. 🌍 Проверьте работу с переводчиками (требуются API ключи)

## Полезные команды

```bash
# Backend тесты
cd backend && go test ./...

# Frontend линтинг
cd frontend && npm run lint

# Сборка production версии
cd frontend && npm run build

# Просмотр production сборки
cd frontend && npm run preview
```

---

**Enjoy Textropy! 🎉**
