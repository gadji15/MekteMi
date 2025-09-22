#!/usr/bin/env bash
set -e

# Ensure .env exists (create from example if missing)
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
  else
    touch .env
  fi
fi

# If APP_KEY is not set in env or .env, generate one
if ! grep -q '^APP_KEY=' .env || [ -z "${APP_KEY}" ]; then
  php artisan key:generate --force || true
fi

# Prefer file cache/queue if not provided to avoid DB tables requirement
export CACHE_DRIVER="${CACHE_DRIVER:-file}"
export QUEUE_CONNECTION="${QUEUE_CONNECTION:-sync}"

# Clear caches to avoid stale config/routes
php artisan config:clear || true
php artisan route:clear || true
php artisan cache:clear || true

# Run migrations (safe to ignore if already up-to-date)
php artisan migrate --force || true

# Ensure storage symlink exists
php artisan storage:link || true

# Health endpoint readiness log
echo "App bootstrap complete. Serving health at /up"

# Determine port ($PORT default to 10000 if not set by platform)
PORT_TO_BIND="${PORT:-10000}"

echo "Starting PHP built-in server on 0.0.0.0:${PORT_TO_BIND}"
exec php -S 0.0.0.0:${PORT_TO_BIND} -t public public/index.php