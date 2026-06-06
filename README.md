# Smartfolio
**Plataforma web para la generación automática de portafolios profesionales y currículos para estudiantes universitarios**

**Proyecto:** BAN 00329 · UTS Bucaramanga  
**Autores:** Nicolás Vega Ruiz · Juan Carlos Rúgeles Navarro  
**Director:** Edward Alfonso Villamizar Vallejo  
**Programa:** Tecnología en Desarrollo de Sistemas Informáticos  

---

## Stack Tecnológico
- **Framework:** Next.js 14 (App Router) + TypeScript
- **Estilos:** TailwindCSS
- **Base de datos + Auth + Storage:** Supabase (PostgreSQL)
- **Generación PDF:** @react-pdf/renderer
- **Validación:** React Hook Form + Zod
- **Estado:** Zustand + TanStack Query
- **Notificaciones:** Sonner
- **Despliegue:** Vercel + Supabase Cloud

---

## Configuración inicial

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/smartfolio.git
cd smartfolio
npm install
```

### 2. Variables de entorno
```bash
cp .env.local.example .env.local
```
Llenar con las credenciales de tu proyecto Supabase.

### 3. Configurar la base de datos
En el SQL Editor de Supabase, ejecutar el archivo:
```
supabase/schema.sql
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```
Abrir http://localhost:3000

---

## Estructura del proyecto
```
src/
├── app/
│   ├── (auth)/          → login, register
│   ├── (dashboard)/     → dashboard, perfil, académico, documentos, cv-builder
│   ├── (admin)/         → panel administrador
│   ├── p/[username]/    → portafolio público (SSR)
│   └── api/             → API routes
├── components/
│   ├── layout/          → Sidebar, TopBar
│   ├── forms/           → AcademicRecordForm, ProfileForm
│   └── cv-templates/    → Modern, Classic, Document PDF
├── lib/
│   ├── supabase/        → client.ts, server.ts
│   ├── cv-generator.ts  → algoritmo de generación del CV
│   ├── validations.ts   → schemas Zod
│   └── utils.ts         → utilidades
└── types/
    └── index.ts         → todos los tipos TypeScript
```

---

## Módulos MVP
| Módulo | Estado |
|--------|--------|
| Autenticación (registro + login) | ✅ |
| Perfil personal + foto | ✅ |
| CRUD Registros académicos (8 tipos) | ✅ |
| Subida de documentos (Supabase Storage) | ✅ |
| Repositorio de documentos | ✅ |
| Generador de CV (3 plantillas) | ✅ |
| Exportación PDF (@react-pdf/renderer) | ✅ |
| Portafolio público SSR | ✅ |
| Panel administrador | ✅ |
| Row Level Security (RLS) | ✅ |

---

## Despliegue en Vercel
```bash
npx vercel deploy
```
Variables de entorno requeridas en Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

*Smartfolio © 2025 · Nicolás Vega Ruiz & Juan Carlos Rúgeles Navarro · UTS Bucaramanga*
