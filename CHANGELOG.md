# Changelog

Todos los cambios importantes de este proyecto serán documentados en este archivo.

El formato sigue una estructura basada en versiones y categorías de cambios.

---

## [Unreleased]

### Added

- Sin cambios documentados.

### Changed

- Sin cambios documentados.

### Fixed

- Sin cambios documentados.

### Removed

- Sin cambios documentados.

### Security

- Sin cambios documentados.

---

## [1.2.0] - 2026-10-23

### Added

- Integración del encabezado compartido de SatCore Solutions mediante el componente `Header`.
- Incorporación de los controles de instalación de la aplicación PWA y cambio de tema en el encabezado.
- Configuración centralizada de metadatos SEO mediante `lib/seo.ts`.
- Incorporación del manifiesto PWA con nombre, descripción, idioma, colores e iconos de Cuponera Digital.
- Definición de constantes para los tipos de descuento, los estados de los cupones y las claves de almacenamiento.

### Changed

- Adaptación de la página principal a la estructura visual compartida de las microapps de SatCore Solutions.
- Actualización del título principal a «Cuponera digital».
- Actualización del texto descriptivo para destacar la creación, administración y validación de cupones.
- Ajuste del diseño principal para mejorar la presentación centrada y adaptable a diferentes tamaños de pantalla.
- Actualización del encabezado para mostrar «Cuponera digital» en lugar de «Comandas digitales».
- Adaptación de la configuración de PostCSS para utilizar `@tailwindcss/postcss`, compatible con Tailwind CSS v4.
- Actualización de la configuración SEO para reflejar el propósito de la aplicación y su identidad corporativa.

### Fixed

- Corrección de la configuración de PostCSS para evitar el uso directo de `tailwindcss` como plugin de PostCSS en Tailwind CSS v4.
- Ajustes en la configuración del proyecto para resolver la dependencia de `autoprefixer` durante la compilación, mediante la actualización de la configuración de PostCSS.

### Removed

- Eliminación de la identidad duplicada de SatCore Solutions en la página principal, al centralizarla en el encabezado compartido.

### Security

- Sin cambios documentados.

---

## [1.0.0] - 2026-10-21

### Added

- Lanzamiento inicial de Cuponera digital.
- Implementación de la aplicación con Next.js, React, TypeScript y Tailwind CSS.
- Incorporación de la interfaz principal para la creación, administración y validación de cupones de descuento.
- Implementación del componente `CouponManager` para gestionar los cupones.
- Incorporación de datos iniciales de cupones mediante `@/lib/data`.
- Definición de los tipos de datos para cupones, descuentos, estados y resultados de validación.
- Implementación de la lógica auxiliar para generar códigos, validar cupones, calcular descuentos y determinar estados.
- Incorporación de campos para configurar el valor del descuento, la compra mínima, la fecha de vencimiento y el límite de usos.
- Integración de la identidad corporativa de SatCore Solutions.
- Incorporación de la configuración inicial de estilos y estructura de la aplicación.

### Changed

- Sin cambios documentados.

### Fixed

- Sin cambios documentados.

### Removed

- Sin cambios documentados.

### Security

- Sin cambios documentados.