# 🐳 Guía de Docker para LaraCRUD

Esta guía te ayudará a levantar el proyecto LaraCRUD usando Docker y Docker Compose.

## 📋 Requisitos Previos

- **Docker Desktop** instalado ([Descargar aquí](https://www.docker.com/products/docker-desktop))
- **Git** (opcional, si clonas desde repositorio)
- Al menos **4GB de RAM** disponible para Docker
- Puertos **8000**, **3306** y **5173** libres

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)

```bash
# Dar permisos de ejecución al script
chmod +x docker-setup.sh

# Ejecutar el script de configuración
./docker-setup.sh
```

El script automáticamente:
- ✅ Crea el archivo `.env`
- ✅ Construye las imágenes Docker
- ✅ Inicia los contenedores
- ✅ Instala dependencias PHP y Node.js
- ✅ Genera la clave de la aplicación
- ✅ Ejecuta las migraciones de base de datos
- ✅ Configura permisos

### Opción 2: Configuración Manual

```bash
# 1. Copiar archivo de entorno
cp .env.example .env

# 2. Construir y levantar contenedores
docker-compose up -d --build

# 3. Instalar dependencias de PHP
docker-compose exec app composer install

# 4. Generar clave de aplicación
docker-compose exec app php artisan key:generate

# 5. Crear enlace simbólico de storage
docker-compose exec app php artisan storage:link

# 6. Ejecutar migraciones
docker-compose exec app php artisan migrate

# 7. Configurar permisos
docker-compose exec app chmod -R 775 storage bootstrap/cache
```

## 🌐 Acceder a la Aplicación

Una vez levantado, puedes acceder a:

- **Aplicación Laravel**: [http://localhost:8000](http://localhost:8000)
- **Vite Dev Server**: [http://localhost:5173](http://localhost:5173)
- **MySQL**: `localhost:3306` (usuario: `laracrud`, password: `secret`)

## 🏗️ Arquitectura de Contenedores

El proyecto usa 4 contenedores:

| Contenedor | Servicio | Puerto | Descripción |
|------------|----------|--------|-------------|
| `laracrud-app` | PHP 8.2-FPM | 9000 | Aplicación Laravel |
| `laracrud-nginx` | Nginx | 8000 | Servidor web |
| `laracrud-mysql` | MySQL 8.0 | 3306 | Base de datos |
| `laracrud-node` | Node.js 20 | 5173 | Compilación de assets (Vite) |

## 📝 Comandos Útiles

### Gestión de Contenedores

```bash
# Ver contenedores en ejecución
docker-compose ps

# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f app
docker-compose logs -f nginx
docker-compose logs -f mysql
docker-compose logs -f node

# Detener contenedores
docker-compose stop

# Iniciar contenedores detenidos
docker-compose start

# Reiniciar contenedores
docker-compose restart

# Detener y eliminar contenedores
docker-compose down

# Eliminar contenedores y volúmenes (⚠️ borra la BD)
docker-compose down -v
```

### Ejecutar Comandos en Contenedores

```bash
# Acceder al contenedor de la aplicación
docker-compose exec app bash

# Ejecutar comandos Artisan
docker-compose exec app php artisan migrate
docker-compose exec app php artisan db:seed
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan route:list

# Ejecutar Composer
docker-compose exec app composer install
docker-compose exec app composer update
docker-compose exec app composer require paquete/nombre

# Ejecutar comandos NPM (desde el contenedor node)
docker-compose exec node npm install
docker-compose exec node npm run build
docker-compose exec node npm run dev
```

### Base de Datos

```bash
# Acceder a MySQL
docker-compose exec mysql mysql -u laracrud -psecret laracrud

# Exportar base de datos
docker-compose exec mysql mysqldump -u laracrud -psecret laracrud > backup.sql

# Importar base de datos
docker-compose exec -T mysql mysql -u laracrud -psecret laracrud < backup.sql

# Reiniciar base de datos (fresh migration)
docker-compose exec app php artisan migrate:fresh --seed
```

### Testing

```bash
# Ejecutar tests con Pest
docker-compose exec app php artisan test

# Ejecutar tests específicos
docker-compose exec app php artisan test --filter NombreDelTest
```

## 🔧 Configuración Personalizada

### Cambiar Puerto de la Aplicación

Edita `docker-compose.yml`:

```yaml
nginx:
  ports:
    - "8080:80"  # Cambia 8000 por el puerto que prefieras
```

### Cambiar Credenciales de MySQL

Edita el archivo `.env`:

```env
DB_DATABASE=tu_base_datos
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
```

Y también actualiza `docker-compose.yml` en la sección `mysql`:

```yaml
mysql:
  environment:
    MYSQL_DATABASE: tu_base_datos
    MYSQL_USER: tu_usuario
    MYSQL_PASSWORD: tu_contraseña
```

### Usar PostgreSQL en lugar de MySQL

1. Modifica `docker-compose.yml`:

```yaml
postgres:
  image: postgres:15
  container_name: laracrud-postgres
  environment:
    POSTGRES_DB: laracrud
    POSTGRES_USER: laracrud
    POSTGRES_PASSWORD: secret
  ports:
    - "5432:5432"
  volumes:
    - postgres-data:/var/lib/postgresql/data
```

2. Actualiza `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
```

## 🐛 Solución de Problemas

### El contenedor no inicia

```bash
# Ver logs detallados
docker-compose logs app

# Reconstruir imagen
docker-compose build --no-cache app
docker-compose up -d
```

### Error de permisos

```bash
# Dar permisos a storage y cache
docker-compose exec app chmod -R 775 storage bootstrap/cache
docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
```

### Puerto en uso

Si los puertos están ocupados, puedes cambiarlos en `docker-compose.yml` o detener el servicio que los está usando:

```bash
# Ver qué está usando el puerto 8000
lsof -i :8000

# Matar el proceso (MacOS/Linux)
kill -9 <PID>
```

### La base de datos no se conecta

```bash
# Verificar que MySQL esté corriendo
docker-compose ps mysql

# Ver logs de MySQL
docker-compose logs mysql

# Reiniciar MySQL
docker-compose restart mysql

# Esperar unos segundos y probar la migración
sleep 10
docker-compose exec app php artisan migrate
```

### Vite no compila los assets

```bash
# Ver logs del contenedor node
docker-compose logs node

# Reinstalar dependencias
docker-compose exec node rm -rf node_modules
docker-compose exec node npm install

# Reiniciar el contenedor
docker-compose restart node
```

### Limpiar todo y empezar de cero

```bash
# Detener y eliminar todo
docker-compose down -v

# Eliminar imágenes
docker-compose rm -f

# Reconstruir desde cero
./docker-setup.sh
```

## 📊 Monitoreo y Performance

### Ver uso de recursos

```bash
# Ver estadísticas en tiempo real
docker stats

# Ver uso de un contenedor específico
docker stats laracrud-app
```

### Ver tamaño de las imágenes

```bash
docker images
```

### Limpiar recursos no usados

```bash
# Limpiar contenedores detenidos, redes no usadas, etc.
docker system prune -a

# Limpiar volúmenes no usados
docker volume prune
```

## 🚀 Producción

Para producción, considera:

1. **Cambiar `APP_DEBUG` a `false`** en `.env`
2. **Usar `APP_ENV=production`**
3. **Configurar un dominio real** en `APP_URL`
4. **Usar contraseñas seguras** para la base de datos
5. **Compilar assets para producción**: `docker-compose exec node npm run build`
6. **Configurar SSL/HTTPS** con Nginx
7. **Usar volúmenes nombrados** para persistencia
8. **Implementar backups** automáticos de la BD

## 🤝 Contribuir

Si encuentras algún problema o tienes sugerencias, por favor abre un issue en GitHub.

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
