# Régal POS & KDS ☕

Sistema Integral de Punto de Venta (Kiosko de Auto-Servicio) y Sistema de Pantallas de Cocina (KDS) diseñado a la medida para **Régal Coffee + Lounge**.

## 🚀 Características Principales

- **Kiosko Responsivo y Táctil (Self-Service):** Interfaz optimizada estrictamente para pantallas en formato vertical (1080x1920). Diseño UI "Pure Black" para máximo contraste/ahorro energético, combinado con elementos *Glassmorphism* (efecto cristal translúcido), acentos dorados y feedback visual inmediato al toque humano.
- **Gestor de Carrito Inteligente:** Control de cantidades mediante _stepper_ (+/-) interactivo, renderizado dinámico y sin recargas, con hidratación de datos en cliente.
- **Checkout Híbrido:** Captura de cliente por nombre y lector de código QR integrado simulando entrada de teclado.
- **KDS en Tiempo Real:** Pantalla de cocina tipo Kanban con alertas sonoras para orquestación de la barra.
- **Impresión Silenciosa:** Integración nativa con impresoras térmicas (58mm/80mm) omitiendo cuadros de diálogo del sistema operativo.

## 💻 Stack Tecnológico

- **Frontend:** HTML5, CSS3 (Custom Properties, Flexbox/Grid), Vanilla JavaScript (Arquitectura sin dependencias).
- **Backend:** PHP 8+ (PDO orientado a objetos).
- **Base de Datos:** MySQL / MariaDB.

## 🛠️ Instalación y Entorno Local

1. Clonar este repositorio en la carpeta `htdocs` (XAMPP) o `www` (WAMP).
2. Crear la base de datos e importar el archivo `database.sql`.
3. Configurar las credenciales en `includes/config.php` y `includes/db.php`.
4. Acceder vía `http://localhost/regal_POS/`.

## 🖥️ Configuración de Producción (Modo Kiosko)

Para desplegar en el hardware físico y asegurar el entorno (evitando que el cliente salga de la app), ejecutar Chrome/Edge con los siguientes _flags_:

```cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk "http://localhost/regal_POS" --incognito --disable-pinch --overscroll-history-navigation=0 --kiosk-printing

--kiosk: Pantalla completa estricta.

--kiosk-printing: Impresión silenciosa directa al ticket.

--disable-pinch & --overscroll-history-navigation=0: Bloquea gestos táctiles del SO.
```
