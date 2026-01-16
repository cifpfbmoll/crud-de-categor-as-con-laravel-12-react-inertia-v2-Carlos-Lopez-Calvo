# Dockerfile para Laravel 12 con PHP 8.3
FROM php:8.3-fpm

# Argumentos de construcción
ARG user=laravel
ARG uid=1000

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    libpq-dev \
    nodejs \
    npm

# Limpiar caché
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar extensiones de PHP
RUN docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd zip

# Obtener Composer desde la imagen oficial
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Crear usuario del sistema para ejecutar comandos de Composer y Artisan
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

# Establecer directorio de trabajo
WORKDIR /var/www

# Copiar archivos de la aplicación
COPY --chown=$user:$user . /var/www

# Cambiar al usuario creado
USER $user

# Exponer puerto 9000 para PHP-FPM
EXPOSE 9000

CMD ["php-fpm"]
