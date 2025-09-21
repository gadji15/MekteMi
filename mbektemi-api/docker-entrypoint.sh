#!/usr/bin/env bash
set -e

# Prepare app key if missing
php artisan key:generate --force || true

# Clear caches to avoid stale config/routes
php artisan config:clear || true
php artisan route:clear || true
php artisan cache:clear || true

# Run migrations (safe to ignore if already up-to-date)
php artisan migrate --force || true

# Ensure storage symlink exists
php artisan storage:link || true

# Determine port (Render provides $PORT, default to 10000 if not set)
PORT_TO_BIND="${PORT:-10000}"

echo "Starting PHP built-in server on 0.0.0.0:${PORT_TO_BIND}"
exec php -S 0.0.0.0:${PORT_TO_BIND} -t public public/index.php