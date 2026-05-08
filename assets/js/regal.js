
const currentCategoryEl = document.getElementById("currentCategory");

// 1. Inicializamos arreglos base
let categories = ["Todos"];
let products = [];

// 2. Hidratación de datos desde PHP (Data Hydration)
if (window.RegalData) {
  const dbCats = window.RegalData.categorias;
  const dbPlatillos = window.RegalData.platillos;
  const baseUrl = window.RegalData.baseUrl;

  const catLookup = {};

  // Mapeamos las categorías de la BD al arreglo de JS
  dbCats.forEach(cat => {
    categories.push(cat.nombre); 
    catLookup[cat.id] = cat.nombre; // Guardamos un diccionario {id: "Nombre"}
  });

  // Aplanamos y mapeamos los platillos al formato que tus funciones ya usan
  Object.keys(dbPlatillos).forEach(catId => {
    dbPlatillos[catId].forEach(p => {
      products.push({
        id: Number(p.id),
        category: catLookup[p.categoria_id],
        name: p.nombre,
        desc: p.descripcion,
        price: Number(p.precio),
        featured: Number(p.destacado) === 1,
        // Resolvemos la ruta de la imagen o inyectamos el placeholder
        img: p.foto 
             ? `${baseUrl}/assets/images/uploads/${p.foto}` 
             : `${baseUrl}/assets/images/placeholder.svg`
      });
    });
  });
} else {
  console.warn("RÉGAL POS: No se encontraron datos dinámicos. Revisa la inyección de PHP.");
}

let activeCategory = "Todos";
let cart = [];

const categoriesEl = document.getElementById("categories");
const productsEl = document.getElementById("products");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const payBtn = document.getElementById("payBtn");

function money(value) {
  return `$${value.toFixed(2)}`;
}

function renderCategories() {
  categoriesEl.innerHTML = categories
    .map(
      (category) => `
    <button class="tab ${category === activeCategory ? "active" : ""}" data-category="${category}">
      ${category}
    </button>
  `,
    )
    .join("");

  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      activeCategory = btn.dataset.category;
      currentCategoryEl.textContent = activeCategory;
      renderCategories();
      renderProducts();
      
      // Opcional: Centrar el botón presionado en la vista (gran toque de UX para kioscos)
      e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  });
}

// ==========================================
// RENDERIZADO Y LÓGICA DE CANTIDADES
// ==========================================

function changeQty(id, amount) {
  const index = cart.findIndex(item => item.id === id);
  
  if (index !== -1) {
    // Si ya existe, modificamos la cantidad
    cart[index].qty += amount;
    
    // Si la cantidad llega a 0 o menos, lo eliminamos del carrito
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
  } else if (amount > 0) {
    // Si no existe y estamos sumando, lo agregamos con cantidad 1
    const product = products.find(item => item.id === id);
    if (product) {
      cart.push({ ...product, qty: amount });
    }
  }

  // Refrescamos ambas vistas para que los botones se sincronicen
  renderCart();
  renderProducts();
}

function renderProducts() {
  const filtered = activeCategory === "Todos"
      ? products
      : products.filter(product => product.category === activeCategory);

  productsEl.innerHTML = filtered.map(product => {
      // Verificamos si este producto ya está en el carrito
      const cartItem = cart.find(item => item.id === product.id);
      const qty = cartItem ? cartItem.qty : 0;

      // Magia del Botón Mutante
      let actionHtml = '';
      if (qty === 0) {
        actionHtml = `<button class="add-btn" onclick="changeQty(${product.id}, 1)">+ Agregar</button>`;
      } else {
        actionHtml = `
          <div class="qty-control">
            <button onclick="changeQty(${product.id}, -1)">−</button>
            <span>${qty}</span>
            <button onclick="changeQty(${product.id}, 1)">+</button>
          </div>
        `;
      }

      return `
        <article class="menu-card">
          <img class="menu-img" src="${product.img}" alt="${product.name}">
          <div class="menu-info">
            ${product.featured ? '<span class="badge">Destacado</span>' : ""}
            <h3>${product.name}</h3>
            <p>${product.desc}</p>
          </div>
          <div class="menu-action">
            <span class="price">${money(product.price)}</span>
            ${actionHtml}
          </div>
        </article>
      `;
    }).join("");
}

function renderCart() {
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="empty">Aún no agregas productos.</p>';
  } else {
    cartItemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <strong class="cart-item-price">${money(item.qty * item.price)}</strong>
        </div>
        
        <div class="qty-control cart-qty">
          <button onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `).join("");
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotalEl.textContent = money(total);
  payBtn.disabled = cart.length === 0;
}

// ==========================================
// LÓGICA DEL MODAL Y LECTOR QR
// ==========================================
const checkoutModal = document.getElementById("checkoutModal");
const checkoutDefaultState = document.getElementById("checkoutDefaultState");
const checkoutScannerState = document.getElementById("checkoutScannerState");

const clientNameInput = document.getElementById("clientName");
const hiddenQrInput = document.getElementById("hiddenQrInput");

const cancelModalBtn = document.getElementById("cancelModalBtn");
const confirmOrderBtn = document.getElementById("confirmOrderBtn");
const scanQrBtn = document.getElementById("scanQrBtn");
const cancelScanBtn = document.getElementById("cancelScanBtn");

// 1. Abrir Modal
payBtn.addEventListener("click", () => {
  if (cart.length === 0) return;
  checkoutModal.style.display = "flex";
  checkoutDefaultState.style.display = "block";
  checkoutScannerState.style.display = "none";
  clientNameInput.value = ""; 
  clientNameInput.focus();
});

// 2. Cerrar Modal
cancelModalBtn.addEventListener("click", () => {
  checkoutModal.style.display = "none";
});

// 3. Pasar a "Modo Escáner"
scanQrBtn.addEventListener("click", () => {
  checkoutDefaultState.style.display = "none";
  checkoutScannerState.style.display = "block";
  
  // Limpiamos y forzamos el foco al input invisible
  hiddenQrInput.value = "";
  hiddenQrInput.focus();
});

// Si el usuario toca la pantalla mientras dice "Acerca tu código...", 
// nos aseguramos de no perder el foco del input invisible
checkoutScannerState.addEventListener("click", () => {
  hiddenQrInput.focus();
});

// 4. Salir de "Modo Escáner"
cancelScanBtn.addEventListener("click", () => {
  checkoutScannerState.style.display = "none";
  checkoutDefaultState.style.display = "block";
  clientNameInput.focus();
});

// 5. ¡ATRAPAR EL CÓDIGO DEL ESCÁNER!
hiddenQrInput.addEventListener("keypress", (e) => {
  // El lector siempre manda un 'Enter' al terminar de leer
  if (e.key === "Enter") {
    const qrData = hiddenQrInput.value.trim();
    if (qrData !== "") {
      // Por ahora, solo haremos un alert para comprobar que funciona.
      // Aquí conectaremos la API para buscar al cliente.
      alert(`¡Código escaneado exitosamente!\nValor: ${qrData}`);
      
      // Regresamos al estado original (temporalmente hasta conectar BD)
      checkoutScannerState.style.display = "none";
      checkoutDefaultState.style.display = "block";
      clientNameInput.value = qrData; // Ponemos el código en el nombre de prueba
    }
  }
});

// 6. Confirmar pedido (El flujo normal que ya tenías)
confirmOrderBtn.addEventListener("click", async () => {
  const nombreCliente = clientNameInput.value.trim() || "Cliente en Barra";
  
  checkoutModal.style.display = "none";
  payBtn.disabled = true;
  payBtn.textContent = "Procesando...";

  const payload = {
    cliente: nombreCliente,
    cart: cart,
    total: cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  };

  try {
    const response = await fetch("api/procesar_pedido.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.success) {
    imprimirTicket(data.folio, cart, payload.total, payload.cliente);
    
    const successModal = document.getElementById("successModal");
    document.getElementById("successFolio").textContent = data.folio;
    
    // NUEVA LÍNEA: Inyectamos el nombre capturado
    document.getElementById("successClientName").textContent = nombreCliente; 
    
    successModal.style.display = "flex";

      document.getElementById("closeSuccessBtn").onclick = () => {
        successModal.style.display = "none";
      };

      cart = [];
      renderCart();
      renderProducts();
    } else {
      alert("Hubo un error procesando tu pedido.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error de conexión.");
  } finally {
    payBtn.textContent = "Pagar pedido";
    payBtn.disabled = cart.length === 0;
  }
});

renderCategories();
renderProducts();
renderCart();

function imprimirTicket(folio, cart, total, nombreCliente) {
  // Aseguramos la ruta base para que encuentre las imágenes sin importar dónde estemos
  const baseUrl = window.RegalData ? window.RegalData.baseUrl : '';

  // Abrimos una ventana temporal
  const ticketWindow = window.open('', '_blank', 'width=400,height=600');
  
  // Armamos la lista de productos
  let itemsHtml = cart.map(item => `
      <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px;">
          <span>${item.qty}x ${item.name}</span>
          <span>$${(item.qty * item.price).toFixed(2)}</span>
      </div>
  `).join('');

  const fechaImpresion = new Date().toLocaleString('es-MX');

  // Dibujamos el HTML del ticket (Estilos monocromáticos, ancho fijo y estructura semántica)
  const ticketHtml = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Ticket ${folio}</title>
          <style>
              /* Reseteamos los márgenes por defecto de impresión del navegador */
              @page { margin: 0; } 
              
              body { 
                  font-family: 'Courier New', Courier, monospace; 
                  width: 80mm; /* Ancho estándar. Cámbialo a 58mm si tu rollo es más estrecho */
                  margin: 0; 
                  padding: 15px; 
                  color: #000; 
                  background: #fff;
                  box-sizing: border-box;
              }
              .text-center { text-align: center; }
              .divider { border-bottom: 1px dashed #000; margin: 10px 0; }
              .total { font-weight: bold; font-size: 16px; margin-top: 10px; }
              p { margin: 3px 0; font-size: 14px; }
              
              /* Clases específicas para el control de imágenes térmicas */
              .logo-header {
                  max-width: 70%;
                  height: auto;
                  margin: 0 auto 5px auto;
                  display: block;
              }
              .qr-placeholder {
                  max-width: 45%;
                  height: auto;
                  margin: 15px auto 5px auto;
                  display: block;
              }
              .logo-footer {
                  max-width: 35%;
                  height: auto;
                  margin: 5px auto 0 auto;
                  display: block;
              }
              .powered-text {
                  font-size: 10px;
                  letter-spacing: 1px;
                  margin-top: 15px;
                  margin-bottom: 2px;
              }
          </style>
      </head>
      <body>
          <div class="text-center">
              <img src="${baseUrl}/assets/images/logo-negro.png" alt="RÉGAL" class="logo-header">
              <p>Coffee + Lounge</p>
          </div>
          
          <div class="divider"></div>
          
          <p>Folio: <strong>${folio}</strong></p>
          <p>Cliente: <strong>${nombreCliente}</strong></p>
          <p>Fecha: ${fechaImpresion}</p>
          
          <div class="divider"></div>
          
          ${itemsHtml}
          
          <div class="divider"></div>
          
          <div style="display: flex; justify-content: space-between;" class="total">
              <span>TOTAL PENDIENTE</span>
              <span>$${total.toFixed(2)}</span>
          </div>
          
          <div class="divider"></div>
          
          <div class="text-center">
              <p>¡Pasa a caja a realizar tu pago!</p>
              <p style="font-size: 12px; margin-top: 5px;">Gracias por tu preferencia.</p>
              
              <img src="${baseUrl}/assets/images/placeholder.svg" alt="QR Code" class="qr-placeholder">
              <p style="font-size: 11px;">Escanea para facturar</p>
              
              <p class="powered-text">POWERED BY</p>
              <img src="${baseUrl}/assets/images/KAI_NN.png" alt="KAI Experience" class="logo-footer">
          </div>
      </body>
      </html>
  `;
  
  ticketWindow.document.open();
  ticketWindow.document.write(ticketHtml);
  ticketWindow.document.close();
  
  // VETERAN TIP: Esperamos a que los PNG y SVG carguen en memoria antes de lanzar la impresión
  ticketWindow.onload = () => {
      ticketWindow.focus();
      ticketWindow.print();
      ticketWindow.onafterprint = () => ticketWindow.close();
  };
}
