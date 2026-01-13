SugarCraft (Version 1\)

## **Descripción completa del proyecto**

### **Visión general**

El proyecto es una **aplicación web publicable** para administrar y explorar un negocio de tiendas que venden **artículos alimentarios** (helados, postres, cakes). La app incluye una **interfaz web moderna** y un **backend con API REST documentada (OpenAPI)**. Está diseñada para ser una **base reutilizable** para futuros proyectos de **test automation, QA y DevOps** (E2E, API tests, CI/CD, etc.).

## **Usuarios y permisos (roles)**

### **2\) Admin (super admin)**

Puede crear, editar, borrar y ver detalles de todos los módulos:

* Articles

* Ingredients *(propios de cada Article)*

* Factories

* Suppliers *(propios de cada Factory)*

* Shops

*(El rol Shop Admin se implementará más adelante.)*

### **2\) Admin de tienda (fase posterior)**

* Solo puede **crear/editar/ver** Shops (idealmente “sus” shops).

* No puede crear ni modificar Factories, Articles, Ingredients, Suppliers.

En la primera etapa se implementa **solo Admin**.

## **Módulos del sistema (dominio)**

### **1\) Ingredient**

Ingrediente base.

* Campos: `id`, `name`

* Se asocia a Articles.

### **2\) Article**

Producto final (ej. helado o cake).

* Campos: `id`, `name`

* Relación:

  * Un Article tiene varios Ingredients.

  * Un Ingredient puede pertenecer a varios Articles. (muchos-a-muchos)

### **3\) Supplier**

Entidad proveedora asociada a una Factory.

* Campos: `id`, `name`, `country`

* Relación:

  * Una Factory tiene **1 o más Suppliers**.

  * Un Supplier pertenece a una Factory (en el modelo actual).

Nota importante (transparencia): en tu ejemplo, cada “supplier” está ligado a un **ingrediente específico** (milk, cherry, etc.). Si quieres representar eso fielmente, lo correcto sería una relación adicional “Factory \+ Ingredient → Supplier”. Pero por tu frase “cada factory tiene 1 o más suppliers”, el modelo mínimo es Supplier ligado a Factory. Si luego quieres el mapeo exacto por ingrediente, se amplía sin romper la base.

### **4\) Factory**

Entidad que fabrica artículos.

* Campos: `id`, `name`, `type (local | international)`, `email`

* Reglas y relaciones:

  * Fabrica **máximo 2 Articles** (regla de negocio).

  * Tiene **1 o más Suppliers**.

  * Puede abastecer a una o varias Shops.

### **5\) Shop**

Tienda en una ciudad.

* Campos: `id`, `name`, `city`

* Relación:

  * Cada Shop está asociada a **una Factory**.

  * Los Articles disponibles en la Shop se derivan de su Factory.

## **Módulos y relaciones (V1)**

### **1\) Article**

Producto final (ej. “See Horse Ice Cream”).

* Campos: `id`, `name`

* Relación:

  * **Article → Ingredients** (1 a muchos)

* Regla:

  * Un Article se considera “completo” cuando tiene **≥ 1 Ingredient**.

### **2\) Ingredient (V1: interno del Article)**

Ingrediente creado dentro de un Article.

* Campos: `id`, `name`, `article_id`

* Pertenece a **un solo Article**

* No se reutiliza entre artículos

### **3\) Factory**

Entidad que fabrica productos.

* Campos: `id`, `name`, `type (local|international)`, `email`

* Relación:

  * **Factory → Articles** (máximo 2\)

  * **Factory → Suppliers** (mínimo 1\)

### **4\) Supplier (V1: interno de la Factory)**

Proveedor creado dentro de una Factory.

* Campos: `id`, `name`, `country`, `factory_id`

* Pertenece a **una sola Factory**

* No abastece Shops directamente

### **5\) Shop**

Tienda que vende productos.

* Campos: `id`, `name`, `city`, `factory_id`

* Pertenece a **una Factory**

* Los Articles disponibles se derivan de la Factory

## **Flujo obligatorio de creación de datos (V1)**

1. **Crear Article**

2. **Crear Ingredients dentro del Article** (mínimo 1\)

3. **Crear Factory** y **asociarle el Article** (máximo 2 artículos por factory)

4. **Crear Suppliers dentro de la Factory** (mínimo 1\)

5. **Crear Shop** seleccionando una Factory  
    ✅ Validación: **no se puede crear Shop si la Factory no tiene Suppliers**

# **SugarCraft (V1) – Flujo de navegación y pantallas**

## **0\) SugarCraft Home (landing)**

Al abrir la aplicación se muestra la **SugarCraft Home Page**, con **3 opciones** (cards o botones):

1. **Article**

2. **Factory**

3. **Shop**

Cada opción navega a su “home” correspondiente.

## **1\) Módulo Article**

### **1.1 Home Article (listado)**

Ruta sugerida: `/articles`

Contenido:

* Listado de **todos los Articles existentes**

* Botón: **Create New Article** → navega a la creación

Cada item del listado incluye:

* el nombre del article

* un **link** para abrir su **Article Details**

### **1.2 Create Article**

Ruta sugerida: `/articles/new`

* Formulario para crear Article (mínimo: `name`)

* **Save** → redirección a **Article Details** del article recién creado

### **1.3 Article Details**

Ruta sugerida: `/articles/:articleId`

Muestra:

* los datos del Article (read-only)

* **listado de Ingredients** pertenecientes a ese Article

Cada Ingredient del listado:

* tiene un **link** a su **Ingredient Details**

Acciones disponibles en V1:

* Botón **Create Ingredient** → abre página de creación de ingrediente

Restricción V1:

* ❌ **No se pueden borrar Articles** (no mostrar botón Delete)

### **1.4 Create Ingredient (dentro de un Article)**

Ruta sugerida: `/articles/:articleId/ingredients/new`

* Formulario para crear un Ingredient (mínimo: `name`)

* El ingrediente queda automáticamente ligado al `articleId`

* **Save** → redirección a **Ingredient Details**

### **1.5 Ingredient Details**

Ruta sugerida: `/articles/:articleId/ingredients/:ingredientId`

Muestra:

* datos del ingrediente

* referencia del Article padre (link opcional para volver)

## **2\) Módulo Factory**

### **2.1 Home Factory (listado)**

Ruta sugerida: `/factories`

Contenido:

* Listado de **todas las Factories existentes**

* Botón: **Create New Factory** → navega a la creación

Cada item del listado incluye:

* nombre de factory

* un **link** para abrir su **Factory Details**

### **2.2 Create Factory**

Ruta sugerida: `/factories/new`

* Formulario Factory: `name`, `type`, `email`

* (y asociación de Articles según la regla V1: 1–2 máximo, si lo incluyes ya en create o después en edit; en V1 puedes hacerlo en create para mantener tu flujo)

* **Save** → redirección a **Factory Details**

### **2.3 Factory Details**

Ruta sugerida: `/factories/:factoryId`

Muestra:

* datos de la factory (read-only)

* listado de **Suppliers** pertenecientes a esa Factory

Cada Supplier del listado:

* tiene un **link** a su **Supplier Details**

Acciones disponibles en V1:

* Botón **Create Supplier** → abre página de creación de supplier

Restricción V1:

* ❌ **No se pueden borrar Factories** (no mostrar botón Delete)

### **2.4 Create Supplier (dentro de una Factory)**

Ruta sugerida: `/factories/:factoryId/suppliers/new`

* Formulario supplier: `name`, `country`

* El supplier queda automáticamente ligado al `factoryId`

* **Save** → redirección a **Supplier Details**

### **2.5 Supplier Details**

Ruta sugerida: `/factories/:factoryId/suppliers/:supplierId`

Muestra:

* datos del supplier

* referencia de la Factory padre (link opcional para volver)

## **3\) Módulo Shop**

### **3.1 Home Shop (listado)**

Ruta sugerida: `/shops`

Contenido:

* Listado de **todos los Shops existentes**

* Botón: **Create New Shop** → navega a la creación

Cada item del listado incluye:

* nombre, ciudad

* (opcional) nombre de Factory asociada

* link a details (si quieres mantener consistencia, recomendado)

  ### **3.3 Shop Details**

**Ruta:** `/shops/:shopId`

Muestra:

* datos del Shop

* Factory asociada

* listado de Articles derivados de la Factory (read-only)

Acciones V1:

* ✅ **Delete Shop**

* ❌ No Edit Factory desde aquí

  ---

  ### **3.4 Delete Shop (confirmación)**

Al hacer click en **Delete Shop**:

1. Se muestra un **mensaje de confirmación**

    “Are you sure you want to delete this shop? This action cannot be undone.”

2. Opciones:

   * **Cancel** → vuelve a Shop Details

   * **Confirm Delete**

     * backend elimina el Shop

     * frontend redirige a **Home Shop**

     * mensaje de éxito opcional

 


   ## **Resumen de reglas V1 reflejadas en UI**

* **❌ Articles no se pueden borrar**

* **❌ Factories no se pueden borrar**

* **✅ Shops sí se pueden borrar (con confirmación)**

* **Ingredients y Suppliers se crean solo desde Details**

* **Shop creation valida Factory con ≥ 1 Supplier**

# **🧩 Tecnologías de SugarCraft (V1)**

## **1️⃣ Frontend (Aplicación Web)**

### **Lenguaje**

* **TypeScript**

  * Superset tipado de JavaScript

  * Reduce errores y mejora mantenibilidad

  * Muy valorado en proyectos profesionales

### **Framework / Tooling**

* **React**

  * SPA moderna basada en componentes

  * Ideal para flujos de navegación claros (Home → List → Details)

* **Vite**

  * Build y dev server muy rápido

  * Mucho más simple que Webpack para proyectos nuevos

### **Estilos / UI**

* **Tailwind CSS**

  * CSS utilitario

  * Permite crear UI limpia sin frameworks pesados

### **Consumo de API**

* **TanStack Query** (React Query)

  * Manejo de llamadas REST

  * Cache, loading, error states

  * Ideal para apps admin

## **2️⃣ Backend (API REST)**

### **Lenguaje**

* **Python 3.12**

### **Framework**

* **FastAPI**

  * API REST moderna

  * Genera automáticamente **OpenAPI / Swagger**

  * Alto rendimiento

  * Perfecta para automation basada en contratos

### **ORM (Base de datos)**

* **SQLAlchemy** (versión 2.0)

  * ORM estándar en Python

  * Manejo de relaciones 1-N (Article→Ingredient, Factory→Supplier)

  * Control total del modelo de datos

### **Migraciones**

* **Alembic**

  * Versionado del esquema de base de datos

  * Migraciones seguras para entornos publicados

### **Servidor ASGI**

* **Uvicorn**

  * Servidor rápido para FastAPI

## **3️⃣ Base de Datos**

### **Producción (recomendada)**

* **PostgreSQL**

  * Base de datos relacional robusta

  * Excelente soporte en SQLAlchemy

  * Estándar en aplicaciones web modernas

### **Desarrollo local (opcional)**

* **SQLite**

  * Arranque rápido

  * Mismo modelo ORM

  * Migrable a PostgreSQL con Alembic

## **4️⃣ DevOps / Infraestructura (V1)**

### **Contenedores**

* **Docker**

  * Entornos reproducibles

  * Ideal para CI/CD y automation

* **Docker Compose**

  * Orquestación local (API \+ DB)

### **CI/CD**

* **GitHub Actions**

  * Lint

  * Tests

  * Build automático

### **Configuración**

* `.env` para variables de entorno

* Configuración por entorno (dev / prod)

## **4️⃣ DevOps / Infraestructura (V1)**

### **Contenedores**

* **Docker**

  * Entornos reproducibles

  * Ideal para CI/CD y automation

* **Docker Compose**

  * Orquestación local (API \+ DB)

### **CI/CD**

* **GitHub Actions**

  * Lint

  * Tests

  * Build automático

### **Configuración**

* `.env` para variables de entorno

* Configuración por entorno (dev / prod)

## **5️⃣ Testing (base preparada para el futuro)**

*(No se implementa todo en V1, pero el stack lo permite sin cambios)*

* **pytest** – tests backend

* **Playwright** – E2E UI tests

* **requests / httpx** – API tests

* **OpenAPI schema** – contract testing

---

## **6️⃣ Publicación (deployment típico)**

* **Frontend**: Vercel o Netlify

* **Backend**: Render o Fly.io

* **Base de datos**: PostgreSQL gestionado

*(La elección exacta del proveedor no afecta al diseño del sistema.)*

