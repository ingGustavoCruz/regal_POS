<?php
// api/update_estado.php
require_once '../includes/config.php';
require_once '../includes/db.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);

if ($data && isset($data['id']) && isset($data['nuevo_estado'])) {
    $pdo = DB::get();
    try {
        $stmt = $pdo->prepare("UPDATE pedidos SET estado_cocina = ? WHERE id = ?");
        $stmt->execute([$data['nuevo_estado'], $data['id']]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
}
?>