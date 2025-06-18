# Этап 1: Сборка React-приложения
FROM node:18-alpine AS build

WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock)
COPY package.json ./
COPY package-lock.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Собираем приложение
RUN npm run build

# Этап 2: Сервировка приложения с помощью Nginx
FROM nginx:1.25-alpine AS production

# Устанавливаем nginx.conf
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Дополнительно: сжатие для ускорения загрузки
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript;
}
EOF

# Копируем собранные статические файлы из этапа сборки
# Предполагаем, что Vite собирает в папку 'dist'. Если это не так, нужно будет изменить на 'build'.
COPY --from=build /app/dist /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

# Команда для запуска Nginx
CMD ["nginx", "-g", "daemon off;"]
