#!/bin/bash

echo "🐳 Configurando LaraCRUD con Docker..."
echo ""

# Colores para mensajes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor, instala Docker primero."
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor, instala Docker Compose primero."
    exit 1
fi

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}📄 Creando archivo .env desde .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Archivo .env creado${NC}"
else
    echo -e "${BLUE}ℹ️  El archivo .env ya existe${NC}"
fi

# Detener contenedores si están corriendo
echo -e "${BLUE}🛑 Deteniendo contenedores existentes...${NC}"
docker-compose down 2>/dev/null || docker compose down 2>/dev/null

# Construir las imágenes
echo -e "${BLUE}🔨 Construyendo imágenes de Docker...${NC}"
docker-compose build || docker compose build

# Iniciar los contenedores
echo -e "${BLUE}🚀 Iniciando contenedores...${NC}"
docker-compose up -d || docker compose up -d

# Esperar a que MySQL esté listo
echo -e "${YELLOW}⏳ Esperando a que MySQL esté listo...${NC}"
sleep 10

# Instalar dependencias de Composer
echo -e "${BLUE}📦 Instalando dependencias de PHP...${NC}"
docker-compose exec -T app composer install || docker compose exec -T app composer install

# Generar la clave de la aplicación
echo -e "${BLUE}🔑 Generando clave de aplicación...${NC}"
docker-compose exec -T app php artisan key:generate || docker compose exec -T app php artisan key:generate

# Crear enlace simbólico de storage
echo -e "${BLUE}🔗 Creando enlace simbólico de storage...${NC}"
docker-compose exec -T app php artisan storage:link || docker compose exec -T app php artisan storage:link

# Ejecutar migraciones
echo -e "${BLUE}🗃️  Ejecutando migraciones de base de datos...${NC}"
docker-compose exec -T app php artisan migrate --force || docker compose exec -T app php artisan migrate --force

# Dar permisos a las carpetas storage y bootstrap/cache
echo -e "${BLUE}🔐 Configurando permisos...${NC}"
docker-compose exec -T app chmod -R 775 storage bootstrap/cache || docker compose exec -T app chmod -R 775 storage bootstrap/cache

echo ""
echo -e "${GREEN}✅ ¡Configuración completada!${NC}"
echo ""
echo -e "${GREEN}🎉 La aplicación está lista en:${NC}"
echo -e "${BLUE}   Frontend: ${GREEN}http://localhost:8000${NC}"
echo -e "${BLUE}   Vite Dev Server: ${GREEN}http://localhost:5173${NC}"
echo ""
echo -e "${YELLOW}📝 Comandos útiles:${NC}"
echo -e "   ${BLUE}docker-compose logs -f${NC}           # Ver logs en tiempo real"
echo -e "   ${BLUE}docker-compose exec app bash${NC}      # Acceder al contenedor"
echo -e "   ${BLUE}docker-compose exec app php artisan${NC} # Ejecutar comandos Artisan"
echo -e "   ${BLUE}docker-compose down${NC}               # Detener contenedores"
echo -e "   ${BLUE}docker-compose restart${NC}            # Reiniciar contenedores"
echo ""
