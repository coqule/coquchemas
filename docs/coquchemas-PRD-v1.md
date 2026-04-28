# Documento Base — Proyecto Catálogo de Camisetas de Fútbol — CoquChemas

## 1. Descripción General del Proyecto

Se desea desarrollar una aplicación web tipo **catálogo de camisetas de fútbol**, la tienda o sitio web se llama CoquChemas. Inicialmente sin funcionalidad de ecommerce, con el objetivo de mostrar productos a clientes y posteriormente evolucionar a una tienda online completa.

El proyecto se desarrollará desde cero utilizando **React + Vite + TypeScript**, apoyándose en **GitHub Copilot (modo Plan)**, **Agents** y **Skills** dentro de **Visual Studio Code**.

La aplicación inicialmente será **local**, pero deberá diseñarse pensando en un **deploy gratuito en la web**, preferiblemente utilizando **Vercel**.

El catálogo obtendrá los productos mediante **web scraping** desde un proveedor externo.

---

# 2. Objetivos del Proyecto

## Objetivo General

Crear un catálogo web moderno, responsive y escalable de camisetas de fútbol que permita mostrar productos a clientes y evolucionar posteriormente a ecommerce.

## Objetivos Específicos

- Crear aplicación React desde cero
- Implementar diseño mobile-first
- Implementar scraping automático de productos
- Mostrar catálogo organizado por categorías
- Preparar arquitectura escalable
- Permitir despliegue gratuito

## Usuarios Objetivo

Usuarios principales:

- Aficionados al fútbol
- Personas interesadas en camisetas retro
- Clientes que compran por WhatsApp

Características:

- Uso mayoritariamente móvil
- Navegación rápida
- Enfoque visual

Objetivo:

Permitir explorar camisetas fácilmente desde móvil
---

# 3. Referencias del Proyecto

## Web de Productos (Scraping)

Fuente de productos:

https://www.gakits.com/

De esta web se obtendrán:

- Nombre del producto
- Imagen
- Precio (no se debe mostrar, solo a futuro para modo admin)
- Categoría
- Link del producto (no mostrar)
- Descripción (si está disponible)


## Web de Referencia de Diseño

Referencia UI/UX:

https://fansdelbarrio.com/

Características del diseño a replicar:

- Diseño mobile-first
- Layout minimalista
- Cards modernas
- Navegación simple
- Enfoque en catálogo
- Scroll vertical para la landing page o home
- Paginación para pagina de catálogo
- Capacidad para cambiar entre modo claro y modo oscuro
- Menu lateral tipo amburguesa
---

# 4. Alcance Inicial (Fase 1)

El proyecto iniciará como **catálogo únicamente**, sin:

- Pagos
- Carrito
- Usuarios
- Checkout

Características iniciales:

- Catálogo de productos
- Filtros por categoría
- Vista detalle producto
- Diseño responsive
- Datos desde JSON

---

# 5. Stack Tecnológico

## Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Axios (proponer alternativas debido a las últimas vulneravilidades identificadas)

## Scraping

- Node.js
- Axios (proponer alternativas debido a las últimas vulneravilidades identificadas)
- Cheerio (proponer alternativas)

## Desarrollo

- Visual Studio Code
- GitHub Copilot
- GitHub Copilot Agents
- GitHub Copilot Skills

## Deploy

- Vercel (principal)
- Netlify (alternativa)
- GitHub Pages (alternativa)
- Hostinger (alternativa, se cuenta con plan premiun)

---

# 6. Arquitectura del Proyecto

Arquitectura propuesta:

Scraper Node.js
      ↓
JSON productos
      ↓
React catálogo
      ↓
Deploy Vercel


Ventajas:

- Fácil mantenimiento
- Escalable
- Bajo costo
- Rápido desarrollo

---

# 7. Estructura del Proyecto

Estructura del proyecto se debe basar en ls mejores prácticas de la industria. Tomar como referencia las skills instaladas.

---

# 8. Modelo de Datos

Producto:

Product:

- id
- name
- team
- league
- season
- price
- image
- category
- type
- description
- link

Ejemplo:

{
  id: 1,
  name: "Alemania 1990 Retro",
  team: "Alemania",
  league: "Selección",
  season: "1990",
  price: "25000",
  image: "image.jpg",
  category: "Retro",
  type: "Fan Version",
  description: "Camiseta retro Alemania",
  link: "url"
}

Durante la implemntentación y configuración del scrapping, se podrían generar ajustes a este modelo.

---

# 9. Funcionalidades

## Página Home

- Grid de productos
- Grid de categorías
- Grid de ligas de fútbol
- Scroll infinito
- Diseño mobile-first
- Cards responsive


## Filtros

- Por equipo
- Por selección
- Por liga
- Retro
- Player Version
- Fan Version
- Otros a recomendar


## Página Detalle

- Imagen grande
- Información producto
- Categoría
- Tipo
- Precio
- Botón WhatsApp (futuro)


## Navegación

- Navbar mobile
- Hamburger menu
- Navegación simple

---


# 10. Scraping

El scraper deberá:

- Conectarse a gakits.com
- Obtener productos
- Parsear HTML
- Guardar resultados

Los datos a obtener:

- Nombre
- Precio
- Imagen
- Categoría
- Link del producto

Guardar en:

- products.json

---

## Estrategia de scraping eleccionada

Se implementará **Scraping Programado** en lugar de scraping en tiempo real.

### Motivo

Ventajas:

- Mejor rendimiento
- Menor consumo de red
- Menor riesgo de bloqueo
- Mejor experiencia usuario
- Mayor escalabilidad

---

## Flujo de Arquitectura del scraping

```
Scraper Node.js
      ↓
products.json
      ↓
React App
      ↓
Deploy Vercel
```

---

## Frecuencia de Actualización

Configuración inicial:

- Actualización diaria

Opciones futuras:

- Cada 12 horas
- Semanal
- Manual

Esta configuraión debe ser parametrizable con el fin de justar de ser necesario.

---

## Automatización

Se utilizará **GitHub Actions** para ejecutar el scraper automáticamente.

Flujo:

```
GitHub Actions
      ↓
Scraper
      ↓
Actualizar JSON
      ↓
Deploy automático Vercel
```

---

## Tecnologías

Scraping:

- Node.js
- Axios
- Cheerio

Opcional:

- Puppeteer
- Playwright

---

## Resultado Esperado

Archivo generado:

products.json

Este archivo será consumido por la aplicación React para mostrar el catálogo.

---

## Estrategia Final

- Scraping programado
- Automatización con GitHub Actions
- Deploy gratuito con Vercel


---

# 11. Fases del Proyecto

## Fase 1

Catálogo básico

- React base
- Datos JSON
- Cards


## Fase 2

Scraping automático

- Script Node
- Actualización productos


## Fase 3

Mejoras UI

- Filtros
- Categorías


## Fase 4

Deploy

- GitHub
- Vercel


## Fase 5 (Futuro)

Ecommerce

- Carrito
- Pagos
- Usuarios

---


# 12. GitHub Copilot — Uso

Se utilizará:

- Copilot modo Plan
- Copilot Chat
- Copilot Agents


Agents sugeridos:

UI Designer

- Diseño mobile-first

React Architect

- Arquitectura escalable

Scraper Expert

- Web scraping

Performance Expert

- Optimización

---

# 13. MCPs 

Los MCPs proporcionarán contexto estructurado para mejorar:

- Generación de código
- Arquitectura
- UI
- Scraping

---

## MCPs Recomendados

- github mcp
- git mcp
- filesystem mcp
- browser mcp
- puppeteer mcp
- playwright mcp
- vercel mcp
- database mcp
- Web Scraping MCP

Durante el modo plan y futuros ajustes, se debe recomendar posibles MCPs para facilitar la implementación.

---

# 14. Requerimientos No Funcionales

- Mobile-first
- Responsive
- Escalable
- Código limpio
- TypeScript tipado
- Componentes reutilizables

---
# 15. Performance

- Lazy loading imágenes
- Pagination
- Scroll infinito optimizado
- Cache productos

---

# 16. Deploy

Opciones gratuitas:

- Vercel (recomendado)
- Netlify
- GitHub Pages
- Hostinger (se cuenta con hosting premiun)


Deploy recomendado:

Vercel + GitHub

---

# 17. Escalabilidad Futura

Funcionalidades futuras:

- Ecommerce completo
- WhatsApp integración
- Carrito
- Pagos
- Base de datos
- Admin panel

---

# 18. Objetivo Final

Crear una web profesional de camisetas de fútbol:

- Moderna
- Escalable
- Mobile-first
- Basada en scraping

Que evolucione de:

Catálogo → Ecommerce completo

---

# 19. Tecnologías Finales

Frontend:

- React
- Vite
- TypeScript
- Tailwind

Backend (Inicial):

- Node.js scraper

Deploy:

- Vercel

---
# 20. Riesgos

- Cambios en estructura gakits.com
- Bloqueo scraping
- Rendimiento imágenes

Mitigación:

- Scraping programado
- Cache JSON
- Lazy loading

---

# 21. Paleta de Colores

La identidad visual de CoquChemas se basa en una paleta de 4 colores principales, pensada para un diseño moderno, minimalista y enfocado en la experiencia mobile-first:

- **Color Primario:** #4377AC
- **Color Secundario (Acento):** #ffce56
      Usado para tag, etiquetas, enlaces y elementos destacados.
- **Color ternario o tercero:** #5335E6
- **Color neutral:** #002244

Variable	Color	Uso
--bg-primary	#00142b	Fondo principal
--bg-secondary	#002040	Cards, inputs
--bg-tertiary	#003257	Imágenes
--text-primary	#ffffff	Texto principal
--text-secondary	#9ca3af	Texto secundario
--text-muted	#6b7280	Texto muted
--border	#1e3a5f	Bordes
--accent	#00c8c8	Acento (cyan)
--surface-variant	#003257	Variante superficie

Estos colores deben aplicarse de forma consistente en todos los componentes y vistas, asegurando accesibilidad y contraste adecuado.
De ser posible se debe evitar el color verde, excluyendo botones o relacionados a whatsapp

# Fin del Documento

Este documento se utilizará como base para:
- Nuevo chat con IA
- GitHub Copilot modo Plan
- Diseño arquitectura inicial

---

# Estado del Proyecto (Actualizado)

## ✅ Completados

### Fase 1: Scraper
- 14,584 productos extraídos
- Modelo de datos con 14 campos
- Scripts optimizados con --start y --pages

### Fase 2: Frontend
- Landing page con hero mejorado
- Sección "Lo más nuevo" (4 productos reales)
- Categorías y equipos dinámicos desde JSON
- Catálogo con filtros y paginación
- Página de detalle de producto
- Dark mode consistente (#00142b)

### Paleta Implementada
- --bg-primary: #00142b
- --bg-secondary: #002040
- --accent-yellow: #ffce56 (precios)
- --accent: #9dcaff

## ⏳ Pendientes
- Deploy a Vercel
- SEO y meta tags
- Rediseño con Stitch MCP (v2)
- Ecommerce (futuro)

