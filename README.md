# Climate Store

Учебный интернет-магазин кондиционеров: публичный каталог и административный CRUD-интерфейс.

## Требования

- Node.js 22 или новее;
- PostgreSQL;
- npm.

## Локальный запуск

1. Запустите PostgreSQL проекта: `docker compose up -d db`. Для локального backend контейнер доступен на порту `5433`, чтобы не конфликтовать с PostgreSQL, установленным в Windows.
2. Скопируйте `.env.example` в `backend/.env` и при необходимости измените `DATABASE_URL`. Если вы используете PostgreSQL без Docker, создайте базу `climate_store` и укажите её адрес.
3. Установите зависимости:

```bash
npm install
```

4. Примените миграции и добавьте демонстрационные данные:

```bash
npm run db:migrate
npm run db:seed:dev -w backend
```

5. Запустите frontend и backend:

```bash
npm run dev
```

Frontend откроется на <http://localhost:5173>, backend — на <http://localhost:3000>.

Доступные адреса API:

- товары: <http://localhost:3000/api/products>;
- производители: <http://localhost:3000/api/brands>;
- категории: <http://localhost:3000/api/categories>;
- проверка состояния: <http://localhost:3000/health>.

`http://localhost:3000/api` является базовым префиксом, но отдельного маршрута `GET /api` в приложении нет.

## Дополнительный запуск через Docker

Docker не требуется для первого домашнего задания. Конфигурация оставлена как дополнительный способ запуска и задел для следующих заданий.

```bash
docker compose up --build -d
docker compose exec backend npm run db:migrate
docker compose exec backend npm run db:seed
```

Приложение: <http://localhost:8080>  
API товаров: <http://localhost:3000/api/products>

## Команды

- `npm run dev` — frontend и backend в режиме разработки;
- `npm run build` — production-сборка;
- `npm test` — тесты;
- `npm run lint` — статическая проверка;
- `npm run db:generate` — генерация SQL-миграции после изменения схемы;
- `npm run db:migrate` — применение миграций;
- `npm run db:seed` — демонстрационные данные.
- `npm run db:seed:dev -w backend` — seed напрямую из TypeScript в разработке.

Административный раздел `/admin` намеренно не защищён авторизацией: это ограничение первой учебной версии.
