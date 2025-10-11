# 🛡️ SecureKanban Frontend

**SecureKanban** es una plataforma web ligera que combina la **gestión ágil de proyectos** con **gestión de riesgos de ciberseguridad**, integrando prácticas **DevSecOps** desde etapas tempranas del desarrollo.

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
| Framework     | **React 18**                            | SPA moderna y eficiente                                 |
| Estilos       | **Tailwind CSS**                        | Diseño rápido, consistente y sin vulnerabilidades CSS   |
| UI Components | **shadcn/ui**                           | Componentes accesibles y consistentes                   |
| Estado global | **Zustand** o **Redux Toolkit**         | Gestión predecible del estado                           |
| Ruteo         | **React Router 6+**                     | Navegación segura entre vistas                          |
| Autenticación | **Keycloak OIDC**                       | Login SSO con roles (Admin/User)                        |
| Validación    | **Zod**                                 | Validación tipada de formularios                        |
| DevSecOps     | **npm audit**, **Snyk**, **Dependabot** | Control continuo de dependencias inseguras              |

---

## 🏗️ Arquitectura General

React (TypeScript)
│
├── Components (UI)
├── Pages (Login, Projects, Backlog, Kanban, Dashboard)
├── Hooks (auth, api, state)
├── Services (HTTP client, OIDC)
├── Store (Zustand/Redux)
└── Config (env, security headers)

**Comunicación con backend:**

> API REST segura (JWT / OpenID Connect) con el backend de **FastAPI**, autenticado vía **Keycloak**.

---

## ⚙️ Instalación y Configuración

### 1️⃣ Requisitos previos

- Node.js ≥ 18.x
- npm o yarn

### 2️⃣ Clonar el repositorio

```bash
git clone https://github.com/ManuelArango1229/Secure_Kanban.git
cd securekanban-frontend

```
