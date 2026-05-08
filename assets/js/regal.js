
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

const checkoutModal = document.getElementById("checkoutModal");
const clientNameInput = document.getElementById("clientName");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const confirmOrderBtn = document.getElementById("confirmOrderBtn");

// 1. Al dar click en Pagar, abrimos el modal
payBtn.addEventListener("click", () => {
  if (cart.length === 0) return;
  checkoutModal.style.display = "flex";
  clientNameInput.value = ""; // Limpiamos el campo
  clientNameInput.focus(); // Enfocamos para que salga el teclado virtual
});

// 2. Botón de cancelar cierra el modal
cancelModalBtn.addEventListener("click", () => {
  checkoutModal.style.display = "none";
});

// 3. Confirmar pedido (AQUÍ VA TU FETCH ORIGINAL)
confirmOrderBtn.addEventListener("click", async () => {
  const nombreCliente = clientNameInput.value.trim() || "Cliente en Barra";
  
  checkoutModal.style.display = "none";
  payBtn.disabled = true;
  payBtn.textContent = "Procesando...";

  // Agregamos el nombre al payload
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
      // 1. Mandamos imprimir el ticket físico llamando a la función que creamos
      imprimirTicket(data.folio, cart, payload.total, payload.cliente); 

      // 2. Notificamos al usuario con nuestro nuevo Modal
      const successModal = document.getElementById("successModal");
      document.getElementById("successFolio").textContent = data.folio;
      successModal.style.display = "flex";

      // Lógica para cerrar el modal de éxito
      document.getElementById("closeSuccessBtn").onclick = () => {
        successModal.style.display = "none";
      };
      
      // 3. Limpiamos el carrito para el siguiente cliente
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
  // Abrimos una ventana temporal
  const ticketWindow = window.open('', '_blank', 'width=400,height=600');
  
  // Armamos la lista de productos
  let itemsHtml = cart.map(item => `
      <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 5px;">
          <span>${item.qty}x ${item.name}</span>
          <span>$${(item.qty * item.price).toFixed(2)}</span>
      </div>
  `).join('');

  // Dibujamos el HTML del ticket (Estilos monocromáticos, ancho fijo)
  ticketWindow.document.write(`
      <html>
      <head>
          <title>Ticket ${folio}</title>
          <style>
              body { 
                font-family: 'Courier New', Courier, monospace; 
                width: 80mm; /* Ancho estándar de impresora térmica */
                margin: 0; 
                padding: 10px; 
                color: #000; 
              }
              .text-center { text-align: center; }
              .divider { border-bottom: 1px dashed #000; margin: 10px 0; }
              .total { font-weight: bold; font-size: 16px; margin-top: 10px; }
              h2 { margin: 5px 0; font-size: 22px; }
              p { margin: 3px 0; font-size: 14px; }
          </style>
      </head>
      <body>
          <h2 class="text-center">RÉGAL</h2>
          <p class="text-center">Coffee + Lounge</p>
          <div class="divider"></div>
          <p>Folio: <strong>${folio}</strong></p>
          <p>Cliente: <strong>${nombreCliente}</strong></p> <p>Fecha: ${new Date().toLocaleString('es-MX')}</p>
          <p>Fecha: ${new Date().toLocaleString('es-MX')}</p>
          <div class="divider"></div>
          
          ${itemsHtml}
          
          <div class="divider"></div>
          <div style="display: flex; justify-content: space-between;" class="total">
              <span>TOTAL PENDIENTE</span>
              <span>$${total.toFixed(2)}</span>
          </div>
          <div class="divider"></div>
          <p class="text-center">¡Pasa a caja a realizar tu pago!</p>
          <p class="text-center" style="font-size: 12px; margin-top: 15px;">Gracias por tu preferencia.</p>
      </body>
      </html>
  `);
  
  ticketWindow.document.close();
  ticketWindow.focus();
  
  // Ejecutamos la impresión y cerramos la ventana al terminar
  ticketWindow.print();
  ticketWindow.onafterprint = () => ticketWindow.close();
}

