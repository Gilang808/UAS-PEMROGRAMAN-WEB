const products = {
  coffee: [
    { id: 'luwak', name: 'Kopi Luwak', price: 80000, img: 'image/luwak1.png' },
    { id: 'espresso', name: 'Espresso', price: 50000, img: 'image/espreso.png' },
    { id: 'latte', name: 'Latte', price: 30000, img: 'image/latte.png' },
    { id: 'cappuccino', name: 'Cappuccino', price: 30000, img: 'image/capucino.png' },
    { id: 'americano', name: 'Americano', price: 35000, img: 'image/americano.png' },
    { id: 'mocha', name: 'Mocha', price: 40000, img: 'image/moca2.png' }
  ],
  noncoffee: [
    { id: 'matcha', name: 'Matcha', price: 60000, img: 'image/matcha latte.jpeg' },
    { id: 'chocolate', name: 'Chocolate Drink', price: 35000, img: 'image/cocolate.jpg' },
    { id: 'strawberry', name: 'Strawberry Smoothie', price: 40000, img: 'image/strawberry.webp' },
    { id: 'honey_lemon', name: 'Oreo Shake', price: 35000, img: 'image/oreo.webp' },
    { id: 'milkshake', name: 'Vanilla Milkshake', price: 40000, img: 'image/vanilla.jpeg' }
  ],
  snack: [
    { id: 'donut', name: 'Donat Coklat', price: 25000, img: 'image/donat.jpg' },
    { id: 'croissant', name: 'Croissant', price: 30000, img: 'image/croissant.jpeg' },
    { id: 'brownies', name: 'Brownies', price: 35000, img: 'image/brownies.jpeg' },
    { id: 'cookies', name: 'Cookies', price: 20000, img: 'image/cookies.jpeg' },
    { id: 'muffin', name: 'Muffin Blueberry', price: 40000, img: 'image/muffin.jpeg' }
  ]
};

let activeCategory = 'coffee';
const cart = {};

// Load Products
function loadProducts() {
  const container = document.getElementById('product-grid');
  container.innerHTML = '';

  products[activeCategory].forEach(product => {
    const qty = cart[product.id] || 0;
    const productItem = document.createElement('div');
    productItem.className = 'product';

    productItem.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
      <div class="counter">
        <button onclick="updateQty('${product.id}', -1)">-</button>
        <input type="text" value="${qty}" readonly>
        <button onclick="updateQty('${product.id}', 1)">+</button>
      </div>
    `;

    container.appendChild(productItem);
  });
}

// Change Category
function changeCategory(category) {
  activeCategory = category;
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelector(`.tab[onclick="changeCategory('${category}')"]`).classList.add('active');
  loadProducts();
}

// Update Quantity
function updateQty(productId, change) {
  cart[productId] = (cart[productId] || 0) + change;
  if (cart[productId] < 0) cart[productId] = 0;
  loadProducts();
  updateOrderSummary();
}

// Update Order Summary
function updateOrderSummary() {
  const orderList = document.getElementById('order-items');
  const totalPriceEl = document.getElementById('total-price');
  orderList.innerHTML = '';

  let total = 0;
  Object.entries(cart).forEach(([productId, qty]) => {
    if (qty > 0) {
      const product = Object.values(products).flat().find(p => p.id === productId);
      const subtotal = product.price * qty;
      total += subtotal;

      const listItem = document.createElement('li');
      listItem.innerHTML = `${product.name} x ${qty} <span>Rp ${subtotal.toLocaleString('id-ID')}</span>`;
      orderList.appendChild(listItem);
    }
  });

  totalPriceEl.textContent = total.toLocaleString('id-ID');
}

// Submit Order
function submitOrder() {
  const name = document.getElementById('customer-name').value;
  const email = document.getElementById('customer-email').value;
  const paymentMethod = document.getElementById('payment-method').value;
  const totalPrice = document.getElementById('total-price').textContent;

  if (!name || !email || !paymentMethod) {
    alert('Harap isi semua informasi pesanan!');
    return;
  }

  // Tampilkan notifikasi pesanan berhasil
  alert('Pesanan berhasil dibuat!\n' +
        `Nama: ${name}\n` +
        `Email: ${email}\n` +
        `Metode Pembayaran: ${paymentMethod}\n` +
        `Total Harga: Rp ${totalPrice}`);
  
  const invoiceId = `INV-${Math.floor(Math.random() * 1000000)}`;
  const date = new Date().toLocaleDateString('id-ID');

  document.getElementById('invoice-id').textContent = invoiceId;
  document.getElementById('invoice-date').textContent = date;
  document.getElementById('invoice-total').textContent = totalPrice;

  const details = Object.entries(cart).map(([productId, qty]) => {
    const product = Object.values(products).flat().find(p => p.id === productId);
    const subtotal = product.price * qty;
    return `<p>${product.name} x ${qty} = Rp ${subtotal.toLocaleString('id-ID')}</p>`;
  }).join('');

  document.getElementById('invoice-details').innerHTML = details;

  document.getElementById('invoice').classList.remove('hidden');
  document.querySelector('.order-container').classList.add('hidden');
}

// Reset Order
function resetOrder() {
  Object.keys(cart).forEach(key => delete cart[key]);
  document.getElementById('invoice').classList.add('hidden');
  document.querySelector('.order-container').classList.remove('hidden');
  updateOrderSummary();
  loadProducts();
}

// Initialize
window.onload = () => {
  loadProducts();
  updateOrderSummary();
};
