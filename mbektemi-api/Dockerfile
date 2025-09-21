# Production Dockerfile for Laravel (PHP 8.3 + Nginx) suitable for Render (Docker)
# Base image with PHP-FPM + Nginx managed by supervisord
FROM webdevops/php-nginx:8.3-alpine

ENV WEB_DOCUMENT_ROOT=/var/www/html/public
WORKDIR /var/www/html

# System deps and PHP extensions
RUN apk add --no-cache git unzip icu-dev libzip-dev oniguruma-dev libpng-dev libpq-dev bash \
 && docker-php-ext-install intl pdo pdo_pgsql

# Install Composer
RUN wget -qO /usr/local/bin/composer https://getcomposer.org/composer-stable.phar \
 && chmod +x /usr/local/bin/composer

# Copy composer files and install dependencies first (better caching)
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Copy the application code
COPY . .

# Prepare permissions and entrypoint
RUN chown -R application:application /var/www/html \
 && mkdir -p storage/logs bootstrap/cache \
 && chown -R application:application storage bootstrap/cache \
 && chmod -R ug+rwX storage bootstrap/cache \
 && chmod +x docker-entrypoint.sh

ENV PHP_DATE_TIMEZONE=Africa/Dakar

EXPOSE 8080

# Start via our entrypoint (runs migrations, storage:link, then launches supervisord)
CMD ["bash", "-lc", "./docker-entrypoint.sh"]