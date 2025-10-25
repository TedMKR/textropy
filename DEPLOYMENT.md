# 🚀 Руководство по Развертыванию Textropy

## Содержание

1. [Требования](#требования)
2. [Локальная разработка](#локальная-разработка)
3. [Docker развертывание](#docker-развертывание)
4. [Production развертывание](#production-развертывание)

---

## Требования

### Backend

- **Go**: 1.21 или выше
- **Git**: для клонирования репозитория

### Frontend

- **Node.js**: 18.x или выше
- **npm** или **yarn** или **pnpm**

### Docker (опционально)

- **Docker**: 20.x или выше
- **Docker Compose**: 2.x или выше

---

## Локальная Разработка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd textropy
```

### 2. Настройка Backend

```bash
cd backend

# Установка зависимостей
go mod download

# Создание .env файла
cp .env.example .env

# Редактирование .env (опционально - для переводчиков)
# nano .env

# Запуск сервера
go run cmd/api/main.go
```

Backend будет доступен на `http://localhost:8080`

**Проверка работы:**

```bash
curl http://localhost:8080/health
```

### 3. Настройка Frontend

Откройте новый терминал:

```bash
cd frontend

# Установка зависимостей
npm install
# или
yarn install
# или
pnpm install

# Создание .env файла
cp .env.example .env

# Запуск dev-сервера
npm run dev
# или
yarn dev
# или
pnpm dev
```

Frontend будет доступен на `http://localhost:5173`

---

## Docker Развертывание

### Развертывание всего стека

```bash
# Из корневой директории проекта
docker-compose up --build
```

Это запустит:

- **Backend**: `http://localhost:8080`
- **Frontend**: `http://localhost:3000`
- **Nginx**: `http://localhost` (проксирует frontend и backend)

### Остановка

```bash
docker-compose down
```

### Пересборка после изменений

```bash
docker-compose up --build --force-recreate
```

---

## Production Развертывание

### 1. Настройка переменных окружения

#### Backend (`backend/.env`)

```bash
PORT=8080
GIN_MODE=release

# API ключи для переводчиков (опционально)
YANDEX_API_KEY=your_production_yandex_key
GOOGLE_API_KEY=your_production_google_key
DEEPL_API_KEY=your_production_deepl_key

CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

#### Frontend (`frontend/.env`)

```bash
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Textropy
VITE_APP_VERSION=1.0.0
```

### 2. Сборка Production

#### Backend

```bash
cd backend
go build -o textropy cmd/api/main.go
./textropy
```

#### Frontend

```bash
cd frontend
npm run build
# Результат в frontend/dist/
```

### 3. Настройка Nginx (Production)

Создайте файл `/etc/nginx/sites-available/textropy`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/textropy/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:8080;
    }
}
```

Активируйте конфигурацию:

```bash
sudo ln -s /etc/nginx/sites-available/textropy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Systemd Service (для автозапуска Backend)

Создайте файл `/etc/systemd/system/textropy.service`:

```ini
[Unit]
Description=Textropy Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/textropy/backend
ExecStart=/opt/textropy/backend/textropy
Restart=always
RestartSec=10
Environment="PORT=8080"
Environment="GIN_MODE=release"

[Install]
WantedBy=multi-user.target
```

Запуск сервиса:

```bash
sudo systemctl daemon-reload
sudo systemctl enable textropy
sudo systemctl start textropy
sudo systemctl status textropy
```

### 5. SSL с Let's Encrypt (опционально)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Настройка API Ключей Переводчиков

### Yandex Translate

1. Перейдите на https://cloud.yandex.ru/
2. Создайте сервисный аккаунт
3. Получите API ключ
4. Добавьте в `.env`: `YANDEX_API_KEY=your_key`

### Google Translate

1. Перейдите на https://console.cloud.google.com/
2. Активируйте Cloud Translation API
3. Создайте API ключ
4. Добавьте в `.env`: `GOOGLE_API_KEY=your_key`

### DeepL

1. Зарегистрируйтесь на https://www.deepl.com/pro-api
2. Получите API ключ (Free или Pro)
3. Добавьте в `.env`: `DEEPL_API_KEY=your_key`

**Примечание**: Приложение будет работать без API ключей, но функция перевода будет недоступна.

---

## Мониторинг и Логи

### Docker Logs

```bash
# Все сервисы
docker-compose logs -f

# Только backend
docker-compose logs -f backend

# Только frontend
docker-compose logs -f frontend
```

### Production Logs

```bash
# Backend (systemd)
sudo journalctl -u textropy -f

# Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## Troubleshooting

### Backend не запускается

```bash
# Проверьте порт
sudo lsof -i :8080

# Проверьте логи
go run cmd/api/main.go
```

### Frontend не подключается к Backend

1. Проверьте `VITE_API_URL` в `.env`
2. Убедитесь, что CORS настроен правильно
3. Проверьте backend здоровье: `curl http://localhost:8080/health`

### Docker проблемы

```bash
# Очистка
docker-compose down -v
docker system prune -a

# Пересборка
docker-compose build --no-cache
docker-compose up
```

---

## Полезные Команды

```bash
# Backend тестирование
cd backend
go test ./...

# Backend линтер
go vet ./...

# Frontend линтер
cd frontend
npm run lint

# Frontend сборка
npm run build

# Docker: только backend
docker-compose up backend

# Docker: только frontend
docker-compose up frontend nginx
```

---

## 🎉 Готово!

Приложение Textropy развернуто и готово к использованию!

**Документация API**: `http://localhost:8080/swagger/index.html`
