# Sistema de Gestión de Biblioteca Universitaria

Sistema web para administrar el préstamo de libros a estudiantes y docentes de la Biblioteca Central.
Toda la información se almacena en **Local Storage**, sin bases de datos externas.

**Curso:** Desarrollo de Aplicaciones Web · **Docente:** Dr. Jaime Suasnábar Terrel
**Universidad Nacional del Centro del Perú** — Ingeniería de Sistemas

---

## Integrantes

| Persona | Integrante | Módulo |
|---|---|---|
| 1 | Gonzales Quiñonez Brittany | Gestión de categorías y libros |
| 2 | Torres Ambrosio Katherine | Solicitud de préstamos e inventario |
| 3 | Ramos Tacza Camilda | Comprobante digital e historial de préstamos |
| 4 | Asturimac Medina Richard Favio | Usuarios, autenticación y navegación |

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| React + TypeScript | Interfaz y tipado estático |
| Vite | Entorno de desarrollo y build |
| React Router DOM | Navegación y rutas protegidas |
| Local Storage | Persistencia de datos |
| jsPDF | Generación del comprobante en PDF |
| uuid | Código único del préstamo |
| SweetAlert2 | Confirmaciones y alertas |

---

## Instalación y ejecución

```bash
npm install
npm run dev