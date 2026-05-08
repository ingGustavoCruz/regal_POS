<?php
// ============================================================
// RÉGAL — Menú público
// ============================================================
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/db.php';
// require_once __DIR__ . '/includes/upload.php';

$pdo = DB::get();

// Categorías activas que tienen al menos 1 platillo disponible
$cats = $pdo->query(
  "SELECT c.* FROM categorias c
   INNER JOIN platillos p ON p.categoria_id = c.id AND p.disponible = 1
   WHERE c.activo = 1
   GROUP BY c.id
   ORDER BY c.orden, c.id"
)->fetchAll();

// Platillos disponibles indexados por categoría
$platillos = [];
if ($cats) {
  $ids   = implode(',', array_column($cats, 'id'));
  $rows  = $pdo->query(
    "SELECT * FROM platillos WHERE disponible = 1 AND categoria_id IN ($ids) ORDER BY orden, id"
  )->fetchAll();
  foreach ($rows as $p) {
    $platillos[$p['categoria_id']][] = $p;
  }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RÉGAL ⦿ MENÚ</title>
  <link rel="stylesheet" href="assets/css/regal.css" />
  <link rel="icon" href="<?= BASE_URL ?>/assets/images/monito01.png" type="image/png">
</head>
<body>

<main class="kiosk">
<section class="hero">
  <div class="hero__content-box"> <div class="hero__logo-tint">
      <img src="<?= BASE_URL ?>/assets/images/regalDorado.png" alt="Régal Coffee + Lounge" class="hero__logo">
    </div>
    
    <h1 class="hero__title">Nuestra Carta</h1>
    <p class="hero__desc">Ingredientes seleccionados, preparaciones cuidadosas y una experiencia hecha para disfrutarse.</p>
    <div class="hero__divider"></div>
  </div> </section>

  <section class="toolbar-kiosk">
  <div class="toolbar-header">
    <strong id="currentCategory">Todos</strong>
    <small>Toca una categoría para explorar</small>
  </div>
  
  <nav class="category-tabs" id="categories"></nav>
</section>

  <section class="menu-layout">
    <div class="menu-list" id="products"></div>

    <aside class="order-box">
      <h2>Mi pedido</h2>
      <div id="cartItems" class="cart-items">
        <p class="empty">Aún no agregas productos.</p>
      </div>

      <div class="total-row">
        <span>Total</span>
        <strong id="cartTotal">$0.00</strong>
      </div>

      <button id="payBtn" disabled>Pagar pedido</button>
    </aside>
  </section>
</main>

<!-- ── FOOTER ─────────────────────────────────────────────── -->
<footer>
  <ul class="social-links">
    <li><a href="https://www.instagram.com/regal_coffeelounge" target="_blank" rel="noopener noreferrer">Instagram</a></li>
    <li><a href="https://www.facebook.com/regalcoffelounge" target="_blank" rel="noopener noreferrer">Facebook</a></li>
    <li><a href="https://wa.me/525540507317" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
    <li><a href="mailto:contacto@regal.mx">Contacto</a></li>
  </ul>
  <div class="copyright">© 2026 Regal. Todos los derechos reservados.</div>
  
  <div class="powered-by-container">
    <div class="powered-by-text">Powered By</div>
    <img src="<?= BASE_URL ?>/assets/images/KAI_NG.png" alt="KAI Experience" class="kai-logo">
  </div>
</footer>

<div id="checkoutModal" class="modal-overlay" style="display: none;">
  <div class="modal-content">
    <h2>¿A nombre de quién preparamos tu pedido?</h2>
    
    <input type="text" id="clientName" placeholder="Toca aquí para escribir tu nombre..." autocomplete="off">
    
    <div class="modal-divider">
      <span>O</span>
    </div>

    <button id="scanQrBtn" class="qr-btn">📷 Escanear mi código Régal</button>

    <div class="modal-actions">
      <button id="cancelModalBtn" class="cancel-btn">Cancelar</button>
      <button id="confirmOrderBtn" class="confirm-btn">Confirmar Pedido</button>
    </div>
  </div>
</div>

<div id="successModal" class="modal-overlay" style="display: none;">
  <div class="modal-content" style="text-align: center;">
    <div style="font-size: 60px; margin-bottom: 10px; animation: modalPopIn 0.5s ease;">✅</div>
    <h2>¡Pedido Confirmado!</h2>
    <p style="color: var(--muted); font-size: 1.1rem; margin-bottom: 20px;">Tu orden ha sido enviada a barra.</p>
    
    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 16px; margin-bottom: 25px; border: 1px dashed var(--gold);">
      <p style="margin: 0; color: var(--cream); font-size: 1rem;">Tu número de folio es:</p>
      <h3 id="successFolio" style="margin: 10px 0 0 0; color: var(--gold2); font-size: 1.8rem; letter-spacing: 2px;"></h3>
    </div>
    
    <p style="margin-bottom: 25px; font-size: 1.1rem;">Recoge tu ticket y <strong>pasa a caja</strong> a realizar tu pago.</p>
    <button id="closeSuccessBtn" class="confirm-btn" style="width: 100%;">Terminar y Volver al Menú</button>
  </div>
</div>

<script>
  // Exponemos los datos del servidor al entorno de cliente de forma segura
  window.RegalData = {
    categorias: <?= json_encode($cats, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT); ?>,
    platillos: <?= json_encode($platillos, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT); ?>,
    baseUrl: "<?= BASE_URL ?>"
  };
</script>

<script src="assets/js/regal.js"></script>
</body>
</html>