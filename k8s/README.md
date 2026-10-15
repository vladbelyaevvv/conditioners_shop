# Climate Store — Kubernetes

Папка содержит артефакты второго домашнего задания по развёртыванию приложения в однодовом кластере Minikube.

## Содержимое

- `00-namespace.yaml` — Namespace приложения;
- `01-secret.yaml` — настройки подключения к PostgreSQL;
- `02-configmap.yaml` — открытая конфигурация backend;
- `03-postgres.yaml` — Service, StatefulSet и PVC PostgreSQL;
- `04-migration-job.yaml` — Job миграции и заполнения базы;
- `05-backend.yaml` — Service и Deployment backend;
- `06-frontend.yaml` — Service и Deployment frontend;
- `docker/` — копии Dockerfile, nginx-конфигурации и `.dockerignore`, использованных при сборке;
- `Отчёт.md` — описание Kubernetes-абстракций и взаимодействия сервисов;
- `Сценарий-скринкаста.md` — порядок демонстрации;
- видеофайл — запись развёртывания, масштабирования и работы UI.

Docker-образы собираются из корня полного проекта:

```bash
docker build -t climate-store-backend:1.0 -f backend/Dockerfile .
docker build -t climate-store-frontend:1.0 -f frontend/Dockerfile .
minikube image load climate-store-backend:1.0
minikube image load climate-store-frontend:1.0
```

## Развёртывание

```bash
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/01-secret.yaml
kubectl apply -f k8s/02-configmap.yaml
kubectl apply -f k8s/03-postgres.yaml
kubectl wait --for=condition=ready pod/postgres-0 -n climate-store --timeout=180s
kubectl apply -f k8s/04-migration-job.yaml
kubectl wait --for=condition=complete job/climate-store-db-init -n climate-store --timeout=120s
kubectl apply -f k8s/05-backend.yaml
kubectl apply -f k8s/06-frontend.yaml
kubectl rollout status deployment/backend -n climate-store
kubectl rollout status deployment/frontend -n climate-store
```

Открытие приложения:

```bash
minikube service frontend -n climate-store --url
```

Масштабирование:

```bash
kubectl scale deployment/backend --replicas=3 -n climate-store
kubectl scale deployment/frontend --replicas=3 -n climate-store
kubectl get deployments,pods -n climate-store
```
