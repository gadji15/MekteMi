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

# Finally, start the web server stack managed by the base image
exec /entrypoint supervisord