# 🛡️ SecureKanban Frontend



Este repositorio contiene el **frontend** de la aplicación, desarrollado en **React + TypeScript**, con un enfoque en **seguridad, escalabilidad y facilidad de integración** con el backend (FastAPI).

---

## 🚀 Objetivo del Proyecto

SecureKanban busca ofrecer a equipos pequeños una herramienta que les permita:

- Gestionar proyectos de manera ágil (tablero Kanban).
- Registrar y dar seguimiento a **riesgos y vulnerabilidades**.
- **Importar reportes** de herramientas open source como Dependency-Track, Trivy o Bandit.
- Visualizar métricas y alertas de seguridad en un **dashboard interactivo**.

---

## 🧩 Tecnologías Principales

| Área          | Tecnología                              | Descripción                                             |
| ------------- | --------------------------------------- | ------------------------------------------------------- |
| Lenguaje      | **TypeScript**                          | Tipado estático, más seguridad en tiempo de compilación |
| Validación    | **Zod**                                 | Validación tipada de formularios                        |
| DevSecOps     | **npm audit**, **Snyk**, **Dependabot** | Control continuo de dependencias inseguras              |

├── Components (UI)
├── Pages (Login, Projects, Backlog, Kanban, Dashboard)
├── Hooks (auth, api, state)
├── Services (HTTP client, OIDC)
└── Config (env, security headers)


> API REST segura (JWT / OpenID Connect) con el backend de **FastAPI**, autenticado vía **Keycloak**.
---


### 1️⃣ Requisitos previos

### 2️⃣ Clonar el repositorio
```bash
git clone https://github.com/ManuelArango1229/Secure_Kanban.git
cd securekanban-frontend

```
📚 Guía de uso de las funciones principales
Sección de Proyectos
Visualiza todos los proyectos creados.
Puedes crear un nuevo proyecto, editar o eliminar los existentes.
Al seleccionar un proyecto, accedes a su tablero Kanban y a los riesgos asociados.
Sección de Riesgos
Muestra la lista de riesgos registrados para cada proyecto.
Permite agregar nuevos riesgos, editar su estado, severidad y comentarios.
Puedes filtrar riesgos por estado, severidad o fecha.
Accede al detalle de cada riesgo para ver historial y comentarios.
Dashboard
Visualiza métricas generales de seguridad y riesgos.
Incluye gráficas de severidad, estado y tendencias de riesgos.
Acceso rápido a alertas y reportes recientes.
Importación de datos desde JSON
Puedes importar riesgos o proyectos desde archivos JSON compatibles.
Ve a la sección correspondiente y selecciona “Importar” o “Importar proyecto/riesgo”.
Selecciona el archivo JSON y confirma la importación.
El sistema validará el formato y agregará los datos automáticamente.

Ejemplo de estructura JSON para riesgos:
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
Consejos de navegación
- Usa la barra lateral para moverte entre Dashboard, Proyectos, Riesgos y Configuración.
- Haz clic en los botones “Crear” o “Importar” para agregar nuevos elementos.
- Utiliza los filtros y búsquedas para encontrar información rápidamente.