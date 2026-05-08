-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-05-2026 a las 07:30:29
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `regal_menu_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admins`
--

CREATE TABLE `admins` (
  `id` int(10) UNSIGNED NOT NULL,
  `usuario` varchar(60) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(120) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `admins`
--

INSERT INTO `admins` (`id`, `usuario`, `password`, `nombre`, `created_at`) VALUES
(1, 'admin', '$2y$10$Hw0yEhpGybS039nks24SY.bDXamysjYD2YtzWFP3rvnJbl0d9noom', 'Administrador Régal', '2026-04-24 15:35:39');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `slug` varchar(80) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `orden` tinyint(3) UNSIGNED DEFAULT 0,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `slug`, `descripcion`, `orden`, `activo`, `created_at`, `updated_at`) VALUES
(1, 'Bebidas Calientes', 'bebidas-calientes', NULL, 1, 1, '2026-04-24 15:35:39', '2026-04-24 15:35:39'),
(2, 'Bebidas Frías', 'bebidas-frias', NULL, 2, 1, '2026-04-24 15:35:39', '2026-04-24 15:35:39'),
(3, 'Desayunos', 'desayunos', NULL, 3, 1, '2026-04-24 15:35:39', '2026-04-24 15:35:39'),
(4, 'Pasteles & Postres', 'pasteles-postres', NULL, 4, 1, '2026-04-24 15:35:39', '2026-04-24 15:35:39'),
(5, 'Snacks', 'snacks', NULL, 5, 1, '2026-04-24 15:35:39', '2026-05-05 19:29:20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL,
  `folio` varchar(20) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `nombre_cliente` varchar(100) DEFAULT NULL,
  `metodo_pago` enum('Caja','Tarjeta','QR_Online') NOT NULL DEFAULT 'Caja',
  `estado_pago` enum('Pendiente','Pagado','Reembolsado') NOT NULL DEFAULT 'Pendiente',
  `estado_cocina` enum('Recibido','En_proceso','Terminado','Entregado') NOT NULL DEFAULT 'Recibido',
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `folio`, `total`, `nombre_cliente`, `metodo_pago`, `estado_pago`, `estado_cocina`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'TCK-2026050615281458', 85.00, NULL, 'Caja', 'Pendiente', 'Entregado', '2026-05-06 15:28:14', '2026-05-06 15:28:39'),
(2, 'TCK-2026050615282869', 66.00, NULL, 'Caja', 'Pendiente', 'Entregado', '2026-05-06 15:28:28', '2026-05-06 15:28:58'),
(3, 'TCK-2026050615284828', 80.00, NULL, 'Caja', 'Pendiente', 'Entregado', '2026-05-06 15:28:48', '2026-05-06 15:28:57'),
(4, 'TCK-2026050616580434', 230.00, NULL, 'Caja', 'Pendiente', 'Entregado', '2026-05-06 16:58:04', '2026-05-07 13:22:15'),
(5, 'TCK-2026050713215973', 261.00, NULL, 'Caja', 'Pendiente', 'Entregado', '2026-05-07 13:21:59', '2026-05-07 13:22:12'),
(6, 'TCK-2026050718525571', 70.00, NULL, 'Caja', 'Pendiente', 'En_proceso', '2026-05-07 18:52:55', '2026-05-07 23:05:32'),
(7, 'TCK-2026050719532736', 130.00, 'Gustavo', 'Caja', 'Pendiente', 'Terminado', '2026-05-07 19:53:27', '2026-05-07 23:03:53'),
(8, 'TCK-2026050723025268', 191.00, 'Gustavo', 'Caja', 'Pendiente', 'En_proceso', '2026-05-07 23:02:52', '2026-05-07 23:03:49'),
(9, 'TCK-2026050723044464', 145.00, 'Tavo', 'Caja', 'Pendiente', 'Recibido', '2026-05-07 23:04:44', '2026-05-07 23:04:44'),
(10, 'TCK-2026050723052234', 140.00, 'Cliente en Barra', 'Caja', 'Pendiente', 'Recibido', '2026-05-07 23:05:22', '2026-05-07 23:05:22'),
(11, 'TCK-2026050723071834', 155.00, 'clau', 'Caja', 'Pendiente', 'Recibido', '2026-05-07 23:07:18', '2026-05-07 23:07:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido_detalles`
--

CREATE TABLE `pedido_detalles` (
  `id` int(11) NOT NULL,
  `pedido_id` int(11) NOT NULL,
  `platillo_id` int(11) NOT NULL,
  `nombre_snapshot` varchar(100) NOT NULL,
  `precio_snapshot` decimal(10,2) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pedido_detalles`
--

INSERT INTO `pedido_detalles` (`id`, `pedido_id`, `platillo_id`, `nombre_snapshot`, `precio_snapshot`, `cantidad`, `subtotal`) VALUES
(1, 1, 14, 'Crostini de Queso', 85.00, 1, 85.00),
(2, 2, 1, 'Espresso Clásico', 66.00, 1, 66.00),
(3, 3, 5, 'Cold Brew', 80.00, 1, 80.00),
(4, 4, 7, 'Matcha Latte Frío', 85.00, 1, 85.00),
(5, 4, 5, 'Cold Brew', 80.00, 1, 80.00),
(6, 4, 11, 'Croissant de Mantequilla', 65.00, 1, 65.00),
(7, 5, 1, 'Espresso Clásico', 66.00, 1, 66.00),
(8, 5, 7, 'Matcha Latte Frío', 85.00, 1, 85.00),
(9, 5, 10, 'Bowl de Granola', 110.00, 1, 110.00),
(10, 6, 4, 'Capuchino', 70.00, 1, 70.00),
(11, 7, 3, 'Americano', 60.00, 1, 60.00),
(12, 7, 4, 'Capuchino', 70.00, 1, 70.00),
(13, 8, 1, 'Espresso Clásico', 66.00, 1, 66.00),
(14, 8, 3, 'Americano', 60.00, 1, 60.00),
(15, 8, 11, 'Croissant de Mantequilla', 65.00, 1, 65.00),
(16, 9, 5, 'Cold Brew', 80.00, 1, 80.00),
(17, 9, 11, 'Croissant de Mantequilla', 65.00, 1, 65.00),
(18, 10, 4, 'Capuchino', 70.00, 2, 140.00),
(19, 11, 9, 'Huevos Benedictinos', 155.00, 1, 155.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `platillos`
--

CREATE TABLE `platillos` (
  `id` int(10) UNSIGNED NOT NULL,
  `categoria_id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(8,2) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `disponible` tinyint(1) NOT NULL DEFAULT 1,
  `destacado` tinyint(1) NOT NULL DEFAULT 0,
  `orden` smallint(5) UNSIGNED DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `platillos`
--

INSERT INTO `platillos` (`id`, `categoria_id`, `nombre`, `descripcion`, `precio`, `imagen`, `disponible`, `destacado`, `orden`, `created_at`, `updated_at`) VALUES
(1, 1, 'Espresso Clásico', 'Extracción perfecta de nuestro blend artesanal, intenso y equilibrado.', 66.00, NULL, 1, 1, 0, '2026-04-24 15:35:39', '2026-05-05 23:27:06'),
(2, 1, 'Latte de Temporada', 'Espresso con leche vaporizada y nuestro sirope especial de la semana.', 75.00, NULL, 1, 1, 0, '2026-04-24 15:35:39', '2026-05-05 19:49:06'),
(3, 1, 'Americano', 'Espresso con agua caliente. Limpio, directo, sin pretensiones.', 60.00, NULL, 1, 0, 0, '2026-04-24 15:35:39', '2026-04-24 15:35:39'),
(4, 1, 'Capuchino', 'Proporción clásica de espresso, leche y espuma cremosa.', 70.00, NULL, 1, 0, 0, '2026-04-24 15:35:39', '2026-04-24 15:35:39'),
(5, 2, 'Cold Brew', '18 horas de extracción en frío. Suave, oscuro y sin acidez.', 80.00, NULL, 1, 1, 0, '2026-04-24 15:35:39', '2026-04-24 15:35:39'),
(6, 2, 'Frappé Caramelo', 'Cold brew, leche, caramelo y crema batida. El favorito de la casa.', 90.00, NULL, 1, 0, 0, '2026-04-24 15:35:39', '2026-04-24 15:35:39'),
(7, 2, 'Matcha Latte Frío', 'Matcha ceremonial japonés con leche de avena. Suave y reconfortante.', 85.00, NULL, 1, 0, 0, '2026-04-24 15:35:39', '2026-04-24 15:35:39'),
(8, 3, 'Tostada Régal', 'Pan artesanal tostado, aguacate, jitomate cherry y aceite de oliva.', 115.00, NULL, 1, 1, 0, '2026-04-24 15:35:39', '2026-04-24 15:35:39'),
(9, 3, 'Huevos Benedictinos', 'Muffin inglés, jamón de pavo, huevos pochados y salsa holandesa.', 155.00, NULL, 1, 0, 0, '2026-04-24 15:35:39', '2026-04-24 15:35:39'),
(10, 3, 'Bowl de Granola', 'Granola artesanal, yogur griego, frutos rojos frescos y miel de abeja.', 110.00, NULL, 1, 0, 0, '2026-04-24 15:35:39', '2026-04-24 15:35:39'),
(11, 4, 'Croissant de Mantequilla', 'Elaborado con mantequilla francesa, hojaldrado y crujiente.', 65.00, NULL, 1, 0, 0, '2026-04-24 15:35:39', '2026-04-24 15:35:39'),
(12, 4, 'Tarta de Limón', 'Base de pasta sablée, crema de limón y merengue italiano.', 85.00, NULL, 1, 1, 0, '2026-04-24 15:35:39', '2026-04-24 15:35:39'),
(13, 4, 'Brownie Intenso', 'Chocolate 70%, nueces tostadas. Servido tibio con helado de vainilla.', 95.00, NULL, 1, 0, 0, '2026-04-24 15:35:39', '2026-04-24 15:35:39'),
(14, 5, 'Crostini de Queso', 'Baguette tostado, queso brie, nuez y reducción de miel.', 85.00, NULL, 1, 0, 0, '2026-04-24 15:35:39', '2026-04-24 15:35:39'),
(15, 5, 'Hummus & Pita', 'Hummus casero con aceite de oliva y paprika ahumada.', 80.00, NULL, 0, 0, 0, '2026-04-24 15:35:39', '2026-05-05 23:27:19');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `folio` (`folio`);

--
-- Indices de la tabla `pedido_detalles`
--
ALTER TABLE `pedido_detalles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pedido_id` (`pedido_id`);

--
-- Indices de la tabla `platillos`
--
ALTER TABLE `platillos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_platillo_categoria` (`categoria_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `pedido_detalles`
--
ALTER TABLE `pedido_detalles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `platillos`
--
ALTER TABLE `platillos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pedido_detalles`
--
ALTER TABLE `pedido_detalles`
  ADD CONSTRAINT `pedido_detalles_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `platillos`
--
ALTER TABLE `platillos`
  ADD CONSTRAINT `fk_platillo_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
