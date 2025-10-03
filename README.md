# CalculadoraDeportes

## Especificaciones del Sistema

**Requisitos mínimos:**
- Node.js versión 18 o superior
- npm (incluido con Node.js)
- 2GB de RAM libre
- Conexión a internet (para base de datos)

**Tecnologías:**
- Next.js 14.2.28
- React 18.2.0
- TypeScript 5.2.2
- PostgreSQL (base de datos externa)
- Prisma ORM

## Manual de Instalación y Ejecución

### 1. Descargar el proyecto
```bash
git clone https://github.com/Andypandita04/CalculadoraDeportes.git
cd CalculadoraDeportes
```

### 2. Ir a la carpeta principal
```bash
cd app
```

### 3. Instalar dependencias
```bash
npm install --legacy-peer-deps
```

### 4. Configurar base de datos
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Ejecutar la aplicación
```bash
npm run dev
```

**La aplicación estará disponible en:**
- http://localhost:3000


## Comandos Útiles

```bash
# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm run start

# Verificar errores de código
npm run lint
```

## Solución de Problemas Comunes

**Error de dependencias:**
```bash
npm cache clean --force
npm install --legacy-peer-deps
```

**Error de Prisma:**
```bash
npx prisma generate
```

