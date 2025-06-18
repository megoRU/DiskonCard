# Этап 1: Сборка приложения
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Этап 2: Запуск с помощью serve
FROM node:18-alpine

WORKDIR /app

# Копируем собранный dist
COPY --from=build /app/dist ./dist

# Устанавливаем serve
RUN npm install -g serve

# Открываем порт
EXPOSE 3000

# Запуск SPA-режима (все пути ведут на index.html)
CMD ["serve", "-s", "dist", "-l", "3000"]
