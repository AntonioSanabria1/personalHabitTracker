# Premium Habit Tracker

Una aplicación web progresiva (PWA) de seguimiento de hábitos construida con Next.js, Tailwind CSS y Zustand. Diseñada con una estética premium *dark mode*, animaciones suaves y una experiencia de usuario orientada a la productividad.

## Características Principales

- **Gestión de Hábitos (CRUD):** Crea, edita y elimina hábitos fácilmente.
- **Checklist Diario:** Interfaz intuitiva para marcar tus hábitos completados cada día.
- **Dashboard y Estadísticas:** Gráficas interactivas con `recharts` para visualizar tu consistencia.
- **Papelera de Reciclaje:** Funcionalidad de *soft delete* que permite recuperar hábitos eliminados accidentalmente.
- **Diseño Premium y Responsivo:** Glassmorphism, paleta de colores basada en `slate` y completamente adaptativa a dispositivos móviles y escritorio.

## Stack Tecnológico

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4 + lucide-react
- **Estado Global:** Zustand
- **Gráficas:** Recharts
- **Base de Datos / Backend (Planeado):** Supabase (PostgreSQL + Auth)
- **Despliegue:** Optimizado para Vercel

## Instalación y Ejecución Local

1. Clona este repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Roadmap

- [x] Configuración inicial y UI base.
- [x] Sistema de estado local optimista (Zustand) con *Seed Data*.
- [x] Gráficas de consistencia.
- [ ] Integración en vivo con Supabase (Autenticación por usuario e inserciones en base de datos real).
- [ ] Configuración completa de PWA para instalación nativa.
