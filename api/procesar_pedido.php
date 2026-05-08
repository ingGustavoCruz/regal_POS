<?php
// api/procesar_pedido.php
require_once '../includes/config.php';
require_once '../includes/db.php';

header('Content-Type: application/json');

// Recibir los datos crudos del body (JSON enviado por JS)
$rawData = file_get_contents("php://input");
$pedido = json_decode($rawData, true);

if (!$pedido || empty($pedido['cart'])) {
    echo json_encode(['success' => false, 'error' => 'Carrito vacío']);
    exit;
}

$pdo = DB::get();

try {
    // Iniciamos una transacción: Todo se guarda o nada se guarda
    $pdo->beginTransaction();

    // 1. Atrapar y sanitizar el nombre del cliente
    // Si viene vacío o no existe, ponemos 'Cliente en Barra' por defecto
    $nombreCliente = !empty($pedido['cliente']) ? trim(strip_tags($pedido['cliente'])) : 'Cliente en Barra';

    // 2. Crear el ticket general
    $folio = 'TCK-' . date('YmdHis') . rand(10, 99);
    $total = $pedido['total']; 
    
    // Modificamos el INSERT para incluir nombre_cliente
    $stmt = $pdo->prepare("INSERT INTO pedidos (folio, total, nombre_cliente, estado_cocina) VALUES (?, ?, ?, 'Recibido')");
    $stmt->execute([$folio, $total, $nombreCliente]);
    $pedido_id = $pdo->lastInsertId();

    // 3. Insertar los detalles de los platillos
    $stmtDetalle = $pdo->prepare("INSERT INTO pedido_detalles (pedido_id, platillo_id, nombre_snapshot, precio_snapshot, cantidad, subtotal) VALUES (?, ?, ?, ?, ?, ?)");
    
    foreach ($pedido['cart'] as $item) {
        $subtotal = $item['price'] * $item['qty'];
        $stmtDetalle->execute([
            $pedido_id, 
            $item['id'], 
            $item['name'], 
            $item['price'], 
            $item['qty'], 
            $subtotal
        ]);
    }

    // Si todo salió bien, confirmamos la transacción
    $pdo->commit();

    echo json_encode([
        'success' => true, 
        'folio' => $folio, 
        'message' => 'Pedido registrado correctamente'
    ]);

} catch (Exception $e) {
    // Si algo falló, deshacemos todo
    $pdo->rollBack();
    echo json_encode(['success' => false, 'error' => 'Error al guardar: ' . $e->getMessage()]);
}
?>