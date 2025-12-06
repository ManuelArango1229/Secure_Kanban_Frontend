# 🛡️ SecureKanban Frontend

Frontend oficial de SecureKanban, desarrollado con React + TypeScript, orientado a buenas prácticas de seguridad, escalabilidad y DevSecOps.
Integra autenticación segura con Keycloak, consume el backend en FastAPI, y se despliega en Vercel.

## 🚀 Objetivo del Proyecto

SecureKanban permite a equipos pequeños:

Gestionar proyectos con un tablero Kanban moderno.

Registrar y hacer seguimiento de riesgos, vulnerabilidades y controles.

Importar reportes desde herramientas open source (Dependency-Track, Trivy, Bandit).

Visualizar métricas y alertas de seguridad en un dashboard interactivo en tiempo real.

Integrarse con pipelines de DevSecOps para análisis, validación y despliegue continuo.

## 🌐 Despliegue

Frontend (Vercel):
https://secure-kanban-frontend.vercel.app/dashboard

Backend (FastAPI – Railway):
https://secure-kanban-backend-production.up.railway.app (ejemplo, ajusta si usas otro dominio)

Autenticación:
Keycloak (OpenID Connect / JWT)

⚠️ El enlace del frontend abre sesión como un usuario ya autenticado. Esto facilita la visualización, ya que el flujo real incluye 2FA.

🧩 Tecnologías Principales
Área	Tecnología	Descripción
Lenguaje	TypeScript	Seguridad en tiempo de compilación
UI/UX	React + Zustand	Componentes modulares y estado global simplificado
Validación	Zod	Validación tipada de formularios
Autenticación	Keycloak (OIDC / JWT)	SSO y flujos seguros
DevSecOps	npm audit, Snyk, Dependabot	Auditoría continua de seguridad
CI/CD	GitHub Actions	Pipelines automáticos
``` 
📁 Estructura del Proyecto
/
├── src/
│   ├── components/      # UI reutilizable
│   ├── pages/           # Login, Projects, Kanban, Dashboard
│   ├── hooks/           # auth, api, estado global
│   ├── services/        # HTTP client, OIDC, API wrappers
│   └── config/          # env, headers, seguridad
└── public/              # assets
```

## ⚙️ Pipelines DevSecOps (GitHub Actions)

A continuación se incluyen pipelines recomendados y listos para integrar en el repositorio.

### 🛠️ 1️⃣ Pipeline – Auditoría de dependencias con npm audit

```
.github/workflows/audit.yml

name: NPM Security Audit

on:
  push:
    branches: ["main"]
  pull_request:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm install

      - name: Run npm audit
        run: npm audit --audit-level=high
```
### 🧪 2️⃣ Pipeline – Tests + Build + Deploy automático a Vercel
```
.github/workflows/deploy.yml

name: Build and Deploy

on:
  push:
    branches: ["main"]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test --if-present

      - name: Build project
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          working-directory: ./
```
### 🔍 3️⃣ Pipeline – Análisis de vulnerabilidades con Snyk
``` 
.github/workflows/snyk.yml

name: Snyk Security Scan

on:
  pull_request:
  push:
    branches: ["main"]

jobs:
  snyk:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Snyk scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

🧷 4️⃣ Pipeline – Integración con Dependency-Track (Envío automático de SBOM)

Si tu pipeline genera un SBOM con cyclonedx, se puede enviar automáticamente al servidor Dependency-Track:
```
.github/workflows/dependency-track.yml

name: SBOM Upload to Dependency-Track

on:
  push:
    branches: ["main"]

jobs:
  sbom:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Generate SBOM
        run: npx @cyclonedx/bom --output bom.json

      - name: Upload SBOM to Dependency-Track
        run: |
          curl -X POST \
          -H "X-Api-Key: ${{ secrets.DT_API_KEY }}" \
          -H "Content-Type: application/json" \
          --data @bom.json \
          "https://dependencytrack.mi-servidor.com/api/v1/bom"
``` 

Esto permite visualizar vulnerabilidades del proyecto automáticamente en Dependency-Track.

## 📚 Guía de Uso

### 📌 1. Sección de Proyectos

- Ver listado de proyectos creados.

- Crear, editar o eliminar proyectos.

- Acceder al tablero Kanban y a los riesgos asociados.

### ⚠️ 2. Sección de Riesgos

- Listado de riesgos por proyecto.

- Crear o modificar riesgos (estado, severidad, comentarios).

- Filtro por severidad, estado o fechas.

- Detalles con historial y comentarios.

### 📊 3. Dashboard

- Gráficos de severidad, estado y tendencia de riesgos.

- Vista rápida de alertas.

- Últimos reportes importados.

## 📥 Importación de Datos (JSON)

Puedes importar proyectos o riesgos desde JSON.

Ejemplo de JSON válido para riesgos:

[
  {
    "nombre": "Riesgo de acceso no autorizado",
    "descripcion": "Posible acceso indebido a datos sensibles",
    "severidad": "Alta",
    "estado": "Pendiente"
  },
  {
    "nombre": "Dependencia vulnerable",
    "descripcion": "Paquete X con vulnerabilidad crítica",
    "severidad": "Crítica",
    "estado": "En progreso"
  }
]
