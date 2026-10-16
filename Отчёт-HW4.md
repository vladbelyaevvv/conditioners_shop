# Отчёт по домашнему заданию: метрики приложения

В этой работе я добавил сбор метрик приложения и базы данных в Kubernetes, чтобы можно было проверять их состояние и смотреть, как используется каталог.

## Что использовал

- Minikube для запуска Kubernetes-кластера на локальном компьютере.
- VictoriaMetrics: `victoria-metrics-k8s-stack` установлен через Helm в namespace `monitoring`. В составе стека работают VictoriaMetrics, vmagent и оператор. Для хранения метрик задан срок 7 дней и PVC размером 1 GiB. Grafana в этом релизе отключена.
- `@prometheus-io/client` в backend на Node.js и Express. Метрики доступны по адресу `/metrics`.
- `postgres-exporter` для получения метрик PostgreSQL. Он запущен отдельным Deployment в namespace `climate-store` и подключается к базе по внутреннему адресу `postgres:5432`.

## Метрики приложения

Кроме стандартных метрик Node.js с префиксом `nodejs_`, backend считает несколько событий, важных для магазина:

| Метрика | Что считает |
| --- | --- |
| `climate_store_catalog_searches_total` | Успешные запросы к каталогу с поисковой строкой |
| `climate_store_product_detail_views_total` | Успешные открытия карточки кондиционера |
| `climate_store_products_created_total` | Успешное создание кондиционера |
| `climate_store_products_updated_total` | Успешное изменение кондиционера |
| `climate_store_products_deleted_total` | Успешное удаление кондиционера |

Все эти метрики являются счётчиками. Они увеличиваются после успешной операции. При перезапуске backend счётчики в памяти процесса начинаются заново; VictoriaMetrics хранит уже собранные значения во временном ряду.

## Как собираются метрики

В манифесте backend-пода указаны аннотации `prometheus.io/scrape`, `prometheus.io/port` и `prometheus.io/path`. Такие же аннотации добавлены к поду `postgres-exporter`.

Для обнаружения подов создан `VMPodScrape` `prometheus-annotations` в namespace `monitoring`. Он ищет поды в namespace `climate-store`, проверяет аннотации и использует их, чтобы определить порт и путь `/metrics`. vmagent обнаруживает эту настройку и регулярно забирает метрики с найденных подов, а затем отправляет их в VictoriaMetrics.

Пароль PostgreSQL не хранится в манифесте экспортера: он передаётся из Kubernetes Secret `climate-store-secret`. Файл с реальными значениями секрета исключён из Git.

## Развёртывание VictoriaMetrics

Настройки Helm сохранены в `k8s/victoria-metrics-values.yaml`. Для установки использовался официальный Helm-репозиторий VictoriaMetrics и команда:

```bash
helm upgrade --install vm-single vm/victoria-metrics-k8s-stack \
  --version 0.96.0 \
  --namespace monitoring \
  --values k8s/victoria-metrics-values.yaml \
  --wait \
  --timeout 10m
```

Основные манифесты приложения и сбора метрик находятся в папке `k8s/`, в том числе `05-backend.yaml`, `07-app-pod-scrape.yaml` и `08-postgres-exporter.yaml`.

## Проверка

Я проверил, что pod backend и pod `postgres-exporter` отображаются в целях сбора как `UP`, ошибок скрейпа нет. В VictoriaMetrics запрос `up{job="backend"}` вернул значение `1`, а `pg_up` — `1`, то есть backend и exporter базы доступны.

Также я выполнил поиск `Ballu` в каталоге. После этого локальная метрика `climate_store_catalog_searches_total` показывала `2`; позже это же значение появилось в VictoriaMetrics. Так я проверил, что бизнес-метрика проходит весь путь от запроса к приложению до хранилища метрик.
