<?php
// ============================================================
// RÉGAL — Menú público
// ============================================================
require_once __DIR__ . '/includes/config.php';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RÉGAL ⦿ KDS Cocina</title>
    <style>
        body { background-color: #121212; color: #fff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { margin: 0; color: #cba052; }
        .status-indicator { font-size: 0.9em; color: #888; }
        
        .kanban-board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .column { background: #1e1e1e; border-radius: 8px; padding: 15px; border-top: 4px solid #444; min-height: 80vh; }
        .col-recibido { border-top-color: #dc3545; } /* Rojo */
        .col-proceso { border-top-color: #007bff; } /* Azul */
        .col-terminado { border-top-color: #28a745; } /* Verde */
        
        .column h2 { text-align: center; margin-top: 0; font-size: 1.2rem; color: #ccc; }
        
        .ticket { background: #2a2a2a; border-radius: 6px; padding: 15px; margin-bottom: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
        .ticket-head { display: flex; justify-content: space-between; border-bottom: 1px solid #444; padding-bottom: 8px; margin-bottom: 10px; font-weight: bold; }
        .ticket-folio { color: #cba052; font-size: 1.1em; }
        
        .ticket-items { list-style: none; padding: 0; margin: 0 0 15px 0; font-size: 1.1em; line-height: 1.5; }
        .ticket-items li { border-bottom: 1px dashed #333; padding: 5px 0; }
        .ticket-items li:last-child { border-bottom: none; }
        
        .btn-action { width: 100%; padding: 12px; border: none; border-radius: 4px; font-weight: bold; font-size: 1em; cursor: pointer; transition: 0.2s; }
        .btn-recibido { background: #007bff; color: #fff; }
        .btn-proceso { background: #28a745; color: #fff; }
        .btn-terminado { background: #cba052; color: #000; }
        .btn-action:active { transform: scale(0.98); }
    </style>
    <link rel="icon" href="<?= BASE_URL ?>/assets/images/monito01.png" type="image/png">
</head>
<body>

    <div class="header">
        <h1>RÉGAL KDS</h1>
        <div class="status-indicator">Última actualización: <span id="lastSync">Cargando...</span></div>
    </div>

    <div class="kanban-board">
        <div class="column col-recibido">
            <h2>Nuevos Pedidos</h2>
            <div id="lista-Recibido"></div>
        </div>
        <div class="column col-proceso">
            <h2>En Preparación</h2>
            <div id="lista-En_proceso"></div>
        </div>
        <div class="column col-terminado">
            <h2>Listos para Entrega</h2>
            <div id="lista-Terminado"></div>
        </div>
    </div>

    <script>
    const flow = {
        'Recibido': { next: 'En_proceso', btnClass: 'btn-recibido', btnText: '▶ Iniciar Preparación' },
        'En_proceso': { next: 'Terminado', btnClass: 'btn-proceso', btnText: '✔ Marcar Terminado' },
        'Terminado': { next: 'Entregado', btnClass: 'btn-terminado', btnText: '🛎️ Entregar a Cliente' }
    };

    // 1. Configuramos el audio (puedes cambiar la URL por un archivo local mp3 en tu servidor)
    const campanaAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    let lastMaxId = 0; // Guardará el ID más alto que hemos visto
    let isFirstLoad = true; // Para no hacer ruido al cargar la página por primera vez

    async function fetchPedidos() {
        try {
            const response = await fetch('api/get_pedidos.php');
            const result = await response.json();
            
            if (result.success) {
                // Buscamos si hay un ID nuevo
                const currentMaxId = result.data.length > 0 ? Math.max(...result.data.map(p => Number(p.id))) : 0;
                
                if (!isFirstLoad && currentMaxId > lastMaxId) {
                    // ¡Cayó un pedido nuevo! Hacemos sonar la campana
                    campanaAudio.play().catch(e => console.warn("Audio bloqueado. Toca la pantalla una vez para habilitarlo."));
                }
                
                lastMaxId = currentMaxId > lastMaxId ? currentMaxId : lastMaxId;
                isFirstLoad = false;

                renderBoard(result.data);
                document.getElementById('lastSync').textContent = new Date().toLocaleTimeString();
            }
        } catch (error) {
            console.error("Error sincronizando KDS:", error);
        }
    }

    function renderBoard(pedidos) {
        document.getElementById('lista-Recibido').innerHTML = '';
        document.getElementById('lista-En_proceso').innerHTML = '';
        document.getElementById('lista-Terminado').innerHTML = '';

        pedidos.forEach(pedido => {
            const step = flow[pedido.estado];
            if (!step) return;

            const itemsHTML = pedido.detalles.map(item => `<li>${item}</li>`).join('');
            
            const ticketHTML = `
                <div class="ticket">
                    <div class="ticket-head">
                        <div>
                            <span class="ticket-folio">${pedido.folio}</span>
                            <div style="color: #fff; font-size: 1.2em; margin-top: 5px;">
                                👤 <strong>${pedido.nombre_cliente || 'Cliente en Barra'}</strong>
                            </div>
                        </div>
                        <span>🕒 ${pedido.hora}</span>
                    </div>
                    <ul class="ticket-items">
                        ${itemsHTML}
                    </ul>
                    <button class="btn-action ${step.btnClass}" onclick="cambiarEstado(${pedido.id}, '${step.next}')">
                        ${step.btnText}
                    </button>
                </div>
            `;

            const container = document.getElementById(`lista-${pedido.estado}`);
            if(container) container.innerHTML += ticketHTML;
        });
    }

    async function cambiarEstado(id, nuevoEstado) {
        try {
            await fetch('api/update_estado.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id, nuevo_estado: nuevoEstado })
            });
            fetchPedidos();
        } catch (error) {
            alert("Error actualizando comanda");
        }
    }

    // Permitir desbloquear audio al hacer clic en cualquier lugar del fondo
    document.body.addEventListener('click', () => {
        campanaAudio.play().then(() => { campanaAudio.pause(); campanaAudio.currentTime = 0; }).catch(()=>{});
    }, { once: true });

    fetchPedidos();
    setInterval(fetchPedidos, 5000);
</script>
</body>
</html>