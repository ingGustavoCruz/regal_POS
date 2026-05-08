<?php
// api/get_pedidos.php
require_once '../includes/config.php';
require_once '../includes/db.php';

header('Content-Type: application/json');

$pdo = DB::get();

try {
    // 1. Traemos los pedidos, AHORA INCLUYENDO nombre_cliente
    $stmt = $pdo->query("SELECT id, folio, nombre_cliente, estado_cocina as estado, DATE_FORMAT(fecha_creacion, '%H:%i') as hora FROM pedidos WHERE estado_cocina != 'Entregado' ORDER BY fecha_creacion ASC");
    $pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $data = [];

    // 2. Para cada pedido, buscamos sus detalles
    foreach ($pedidos as $pedido) {
        $stmtDetalles = $pdo->prepare("SELECT cantidad, nombre_snapshot as nombre FROM pedido_detalles WHERE pedido_id = ?");
        $stmtDetalles->execute([$pedido['id']]);
        $detallesBD = $stmtDetalles->fetchAll(PDO::FETCH_ASSOC);

        $itemsFormateados = [];
        foreach ($detallesBD as $detalle) {
            $itemsFormateados[] = $detalle['cantidad'] . "x " . $detalle['nombre'];
        }

        // 3. Empaquetamos todo, asegurando que nombre_cliente vaya en el JSON
        $data[] = [
            'id' => $pedido['id'],
            'folio' => $pedido['folio'],
            'nombre_cliente' => $pedido['nombre_cliente'] ?? 'Cliente en Barra', // <-- ¡Esto es vital!
            'estado' => $pedido['estado'],
            'hora' => $pedido['hora'],
            'detalles' => $itemsFormateados
        ];
    }

    echo json_encode(['success' => true, 'data' => $data]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>