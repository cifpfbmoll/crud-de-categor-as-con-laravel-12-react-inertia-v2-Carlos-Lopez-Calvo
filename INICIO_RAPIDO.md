# 🚀 Inicio Rápido con Docker

## ⚡ Opción 1: Script Automático (Recomendado)

```bash
./docker-setup.sh
```

**¡Listo!** La aplicación estará disponible en: http://localhost:8000

---

## 🛠️ Opción 2: Comandos con Makefile

```bash
# Primera vez
make setup

# Ver todos los comandos disponibles
make help
```

### Comandos más usados:

```bash
make up           # Iniciar contenedores
make down         # Detener contenedores
make logs         # Ver logs
make shell        # Acceder al contenedor
make migrate      # Ejecutar migraciones
make test         # Ejecutar tests
```

---

## 📦 Opción 3: Docker Compose Manual

```bash
# 1. Copiar archivo de entorno
cp .env.example .env

# 2. Levantar contenedores
docker-compose up -d --build

# 3. Instalar dependencias
docker-compose exec app composer install

# 4. Generar clave
docker-compose exec app php artisan key:generate

# 5. Ejecutar migraciones
docker-compose exec app php artisan migrate

# 6. Configurar permisos
docker-compose exec app chmod -R 775 storage bootstrap/cache
```

---

## 🌐 URLs de Acceso

- **Aplicación**: http://localhost:8000
- **Vite (Hot Reload)**: http://localhost:5173
- **MySQL**: localhost:3306
  - Usuario: `laracrud`
  - Password: `secret`
  - Base de datos: `laracrud`

---

## ❓ ¿Problemas?

Revisa la guía completa en [DOCKER_README.md](DOCKER_README.md)

```bash
# Ver logs
docker-compose logs -f

# Reiniciar desde cero
docker-compose down -v
./docker-setup.sh
```

---

## 🎯 Próximos Pasos

1. **Registrar un usuario** en http://localhost:8000/register
2. **Crear productos** en el dashboard
3. **Revisar el código** en `resources/js/Pages/Products/Index.tsx`
4. **Modificar y ver cambios** en tiempo real gracias a Vite

¡Feliz desarrollo! 🎉
