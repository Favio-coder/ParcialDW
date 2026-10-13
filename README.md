# Biblioteca Central · UNCP

Aplicación web para la gestión de servicios de la Biblioteca Central de la Universidad Nacional del Centro del Perú. La información de usuarios y sesiones se guarda en Local Storage para esta demostración.

## Requisitos

- Node.js
- npm

## Desarrollo

```bash
npm install
npm run dev
```

Para comprobar la aplicación:

```bash
npm run build
npm run lint
```

## Usuarios y acceso

- Los estudiantes y docentes pueden crear una cuenta en `/registro` con sus datos universitarios. El código universitario y el correo no pueden repetirse.
- Las contraseñas se almacenan como hashes PBKDF2 con sal; no se guarda la contraseña en texto plano.
- Los administradores acceden al directorio privado en `/admin/usuarios`, donde pueden buscar, filtrar y exportar las cuentas registradas a CSV.
- Cuenta de demostración: `admin@biblioteca.edu.pe` / `Admin2026!`.

La cuenta fija de administración y la persistencia en el navegador son exclusivamente para la demostración local; no sustituyen un servicio de autenticación ni almacenamiento seguro para producción.
