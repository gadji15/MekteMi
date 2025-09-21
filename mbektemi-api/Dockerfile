# Production Dockerfile for Laravel (PHP 8.3 CLI) suitable for Render (Docker)
# Render expects the app to bind on $PORT, we use PHP built-in server for simplicity.

FROM php:8.3-alpine

ENV APP_ENV=production
ENV PHP_DATE_TIMEZONE=Africa/Dakar
ENV COMPOSER_ALLOW_SUPERUSER=1
WORKDIR /var/www/html

# System deps and PHP extensions
RUN apk add --no-cache git unzip icu-dev libzip-dev oniguruma-dev libpng-dev libpq-dev bash \
 && docker-php-ext-install intl pdo pdo_pgsql

# Install Composer
RUN wget -qO /usr/local/bin/composer https://getcomposer.org/composer-stable.phar \
 && chmod +x /usr/local/bin/composer

# Copy composer files and install dependencies first (better caching)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-progress --no-scripts

# Copy the application code
COPY . .

# Optimize autoload and discover packages (artisan exists now)
RUN composer dump-autoload -o \
 && php artisan package:discover --ansi || true \
 && mkdir -p storage/logs bootstrap/cache \
 && chmod -R 775 storage bootstrap/cache

# Ensure entrypoint is executable
RUN chmod +x docker-entrypoint.sh

# Render injects $PORT (default 10000). We'll bind to that.
EXPOSE 10000

# Start via entrypoint: run migrations, storage:link, then launch PHP built-in server
CMD ["bash", "-lc", "./docker-entrypoint.sh"]