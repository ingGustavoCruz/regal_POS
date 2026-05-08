# Régal POS & KDS ☕

Sistema de Punto de Venta (Kiosko) y Sistema de Pantallas de Cocina (KDS) desarrollado para **Régal Coffee + Lounge**.

## Características Principales 🚀

- **Kiosko Responsivo:** Interfaz optimizada para pantallas táctiles verticales (1080x1920) con modo oscuro y acentos dorados.
- **Gestor de Carrito Inteligente:** Stepper interactivo (+/-) para control de cantidades sin recargar la página.
- **KDS en Tiempo Real:** Pantalla de cocina tipo Kanban con alertas sonoras para nuevos pedidos.
- **Checkout Integrado:** Captura de nombre de cliente y (próximamente) lectura de código QR.
- **Impresión Automática:** Configurado para impresión de tickets térmicos sin cuadros de diálogo (vía flags de Chrome).

## Stack Tecnológico 💻

- **Frontend:** HTML5, CSS3 (Custom Variables, Flexbox/Grid), Vanilla JavaScript.
- **Backend:** PHP 8+ (PDO para base de datos).
- **Base de Datos:** MySQL / MariaDB.

## Instalación Local 🛠️

1. Clonar el repositorio en la carpeta `htdocs` (XAMPP) o `www` (WAMP).
2. Importar el archivo de base de datos (asegúrate de crear el `.sql` exportado).
3. Configurar las credenciales en `includes/config.php` y `includes/db.php`.
4. Acceder vía `http://localhost/regal_POS/`.
