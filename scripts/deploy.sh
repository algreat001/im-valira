#!/usr/bin/env bash
set -euo pipefail

# ========= ПАРАМЕТРЫ ДЕПЛОЯ =========
# Хост/пользователь SSH
SSH_HOST="${SSH_HOST:-your.server.com}"
SSH_USER="${SSH_USER:-deploy}"
SSH_PORT="${SSH_PORT:-22}"

# Путь до директории приложения на сервере
APP_DIR="${APP_DIR:-/opt/your-app}"

# Git-репозиторий и ветка
REPO_URL="${REPO_URL:-git@github.com:your-org/your-repo.git}"
BRANCH="${BRANCH:-main}"

# Имя процесса PM2 (если systemd не используется)
PM2_APP_NAME="${PM2_APP_NAME:-backend-app}"

# ========= ПРОВЕРКА ЗАВИСИМОСТЕЙ НА ЛОКАЛЬНОЙ МАШИНЕ =========
if ! command -v ssh >/dev/null 2>&1; then
  echo "Ошибка: ssh не установлен на локальной машине." >&2
  exit 1
fi

echo "Подключение к ${SSH_USER}@${SSH_HOST}:${SSH_PORT}"
ssh -p "${SSH_PORT}" "${SSH_USER}@${SSH_HOST}" "bash -s" <<EOF
set -euo pipefail

echo "==> Подготовка директории приложения: ${APP_DIR}"
mkdir -p "${APP_DIR}"
cd "${APP_DIR}"

# Проверка наличия Node.js и Yarn на сервере
if ! command -v node >/dev/null 2>&1; then
  echo "Ошибка: Node.js не установлен на сервере." >&2
  echo "Установите Node.js (рекомендуется LTS) и повторите попытку." >&2
  exit 2
fi
if ! command -v yarn >/dev/null 2>&1; then
  echo "Ошибка: Yarn не установлен на сервере." >&2
  echo "Установите Yarn (Corepack: corepack enable && corepack prepare yarn@stable --activate) и повторите попытку." >&2
  exit 3
fi

# Клонирование/обновление репозитория
if [ ! -d ".git" ]; then
  echo "==> Клонирую репозиторий ${REPO_URL} в ${APP_DIR}"
  git clone --branch "${BRANCH}" --single-branch "${REPO_URL}" .
else
  echo "==> Обновляю репозиторий (${BRANCH})"
  git fetch --all --prune
  git checkout "${BRANCH}"
  git reset --hard "origin/${BRANCH}"
fi

# Сборка backend
echo "==> Сборка backend"
cd backend
yarn install --frozen-lockfile
yarn build

# Сборка frontends/administration
echo "==> Сборка frontends/administration"
cd ../frontends/administration
yarn install --frozen-lockfile
yarn build

# Сборка frontends/market
echo "==> Сборка frontends/market"
cd ../market
yarn install --frozen-lockfile
yarn build

# Раскладка статики фронтендов в backend/public
echo "==> Копирование статических файлов фронтендов в backend/public"
cd ../../backend
mkdir -p public/admin public/market
rm -rf public/admin/* public/market/*

cp -R ../frontends/administration/dist/* public/admin/ || true
cp -R ../frontends/market/dist/* public/market/ || true

# Перезапуск backend
echo "==> Перезапуск backend"
# 1) Если есть systemd unit (backend.service) — перезапускаем его
if command -v systemctl >/dev/null 2>&1 && systemctl list-unit-files | grep -q "^backend\.service"; then
  echo "Найден systemd unit backend.service — перезапуск..."
  sudo systemctl restart backend
  sudo systemctl status backend --no-pager -l || true
else
  # 2) Иначе — управляём через PM2
  if command -v pm2 >/dev/null 2>&1; then
    if pm2 list | grep -q "${PM2_APP_NAME}"; then
      echo "Перезапуск PM2 процесса ${PM2_APP_NAME}"
      pm2 restart "${PM2_APP_NAME}"
    else
      echo "Старт PM2 процесса ${PM2_APP_NAME}"
      pm2 start "node dist/main" --name "${PM2_APP_NAME}"
    fi
    pm2 save || true
  else
    echo "Внимание: не найден systemd unit backend.service и не установлен pm2."
    echo "Бэкенд не перезапущен автоматически. Запустите вручную: node backend/dist/main"
  fi
fi

echo "==> Деплой завершен успешно."
EOF

echo "Готово."
echo "Подсказка: можно экспортировать параметры деплоя, например:"
echo "  SSH_HOST=your.server.com SSH_USER=deploy REPO_URL=git@github.com:org/repo.git BRANCH=main APP_DIR=/opt/your-app scripts/deploy.sh"
