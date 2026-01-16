.PHONY: help setup up down restart logs shell composer artisan npm test clean rebuild

# Colores para output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m # No Color

help: ## Mostrar esta ayuda
	@echo "$(GREEN)🐳 LaraCRUD - Comandos Docker$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(BLUE)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ""

setup: ## Configuración inicial completa (ejecutar la primera vez)
	@echo "$(GREEN)🚀 Iniciando configuración...$(NC)"
	@./docker-setup.sh

up: ## Iniciar contenedores
	@echo "$(GREEN)⬆️  Iniciando contenedores...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)✅ Contenedores iniciados$(NC)"

down: ## Detener contenedores
	@echo "$(YELLOW)⬇️  Deteniendo contenedores...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✅ Contenedores detenidos$(NC)"

restart: ## Reiniciar contenedores
	@echo "$(YELLOW)🔄 Reiniciando contenedores...$(NC)"
	@docker-compose restart
	@echo "$(GREEN)✅ Contenedores reiniciados$(NC)"

logs: ## Ver logs de todos los servicios
	@docker-compose logs -f

logs-app: ## Ver logs de la aplicación
	@docker-compose logs -f app

logs-nginx: ## Ver logs de Nginx
	@docker-compose logs -f nginx

logs-mysql: ## Ver logs de MySQL
	@docker-compose logs -f mysql

logs-node: ## Ver logs de Node/Vite
	@docker-compose logs -f node

shell: ## Acceder al contenedor de la aplicación
	@docker-compose exec app bash

shell-node: ## Acceder al contenedor de Node
	@docker-compose exec node sh

mysql: ## Acceder a MySQL CLI
	@docker-compose exec mysql mysql -u laracrud -psecret laracrud

composer: ## Ejecutar composer install
	@docker-compose exec app composer install

composer-update: ## Actualizar dependencias de Composer
	@docker-compose exec app composer update

npm-install: ## Instalar dependencias de NPM
	@docker-compose exec node npm install

npm-build: ## Compilar assets para producción
	@docker-compose exec node npm run build

artisan: ## Ejecutar comando artisan (ej: make artisan cmd="migrate")
	@docker-compose exec app php artisan $(cmd)

migrate: ## Ejecutar migraciones
	@docker-compose exec app php artisan migrate

migrate-fresh: ## Reiniciar base de datos con migraciones
	@docker-compose exec app php artisan migrate:fresh

migrate-seed: ## Reiniciar base de datos con migraciones y seeders
	@docker-compose exec app php artisan migrate:fresh --seed

seed: ## Ejecutar seeders
	@docker-compose exec app php artisan db:seed

cache-clear: ## Limpiar todas las cachés
	@docker-compose exec app php artisan cache:clear
	@docker-compose exec app php artisan config:clear
	@docker-compose exec app php artisan route:clear
	@docker-compose exec app php artisan view:clear

test: ## Ejecutar tests
	@docker-compose exec app php artisan test

test-coverage: ## Ejecutar tests con cobertura
	@docker-compose exec app php artisan test --coverage

ps: ## Ver estado de los contenedores
	@docker-compose ps

stats: ## Ver uso de recursos
	@docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

clean: ## Limpiar contenedores, volúmenes e imágenes
	@echo "$(YELLOW)⚠️  ¿Estás seguro? Esto eliminará todos los datos. [y/N]$(NC)"
	@read -r answer; \
	if [ "$$answer" = "y" ]; then \
		docker-compose down -v; \
		docker system prune -f; \
		echo "$(GREEN)✅ Limpieza completada$(NC)"; \
	else \
		echo "$(YELLOW)❌ Cancelado$(NC)"; \
	fi

rebuild: ## Reconstruir contenedores desde cero
	@echo "$(YELLOW)🔨 Reconstruyendo contenedores...$(NC)"
	@docker-compose down
	@docker-compose build --no-cache
	@docker-compose up -d
	@echo "$(GREEN)✅ Contenedores reconstruidos$(NC)"

permissions: ## Arreglar permisos de storage y cache
	@docker-compose exec app chmod -R 775 storage bootstrap/cache
	@docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
	@echo "$(GREEN)✅ Permisos configurados$(NC)"

backup-db: ## Crear backup de la base de datos
	@echo "$(GREEN)💾 Creando backup...$(NC)"
	@docker-compose exec mysql mysqldump -u laracrud -psecret laracrud > backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✅ Backup creado$(NC)"

restore-db: ## Restaurar base de datos (ej: make restore-db file=backup.sql)
	@echo "$(YELLOW)📥 Restaurando backup...$(NC)"
	@docker-compose exec -T mysql mysql -u laracrud -psecret laracrud < $(file)
	@echo "$(GREEN)✅ Backup restaurado$(NC)"

dev: ## Modo desarrollo (logs en tiempo real)
	@docker-compose up

status: ## Mostrar estado de la aplicación
	@echo "$(GREEN)📊 Estado de LaraCRUD$(NC)"
	@echo ""
	@echo "$(BLUE)Contenedores:$(NC)"
	@docker-compose ps
	@echo ""
	@echo "$(BLUE)URLs:$(NC)"
	@echo "  Aplicación: http://localhost:8000"
	@echo "  Vite Dev:   http://localhost:5173"
	@echo ""
