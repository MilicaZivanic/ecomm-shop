const cartOverlay = document.querySelector('.cart-overlay');
const cart = document.querySelector('.cart');
const cartQuantity = document.querySelector('.number');
const cartTotal = document.querySelector('.cart-total');
const cartContainer = document.querySelector('.cart-content');
const modalBg = document.querySelector('.modalProduct-bg');
let shoppingCart = [];
const SESSION_STORAGE_KEY = 'SHOPPING_CART';

function setupShoppingCart() {
  $(document).on('click', function (event) {
    if (event.target.matches('.remove-item')) {
      const id = parseInt(event.target.closest('.cart-item').dataset.id);
      removeFromCart(id);
    }
  });
  $(document).on('click', function (event) {
    if (event.target.matches('#up')) {
      const id = parseInt(event.target.closest('.cart-item').dataset.id);
      addOneProduct(id);
    }
  });
  $(document).on('click', function (event) {
    if (event.target.matches('#down')) {
      const id = parseInt(event.target.closest('.cart-item').dataset.id);
      removeOneProduct(id);
    }
  });

  shoppingCart = loadCart();
  renderCartItems();
}
setupShoppingCart();

function addToCart(id) {
  const existingItem = shoppingCart.find(entry => entry.id === id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    shoppingCart.push({ id: id, quantity: 1 });
  }
  renderCartItems();
  saveCart();
}

function removeFromCart(id) {
  const existingItem = shoppingCart.find(entry => entry.id === id);
  if (existingItem == null) return;
  shoppingCart = shoppingCart.filter(entry => entry.id !== id);
  renderCartItems();
  saveCart();
}

function saveCart() {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(shoppingCart));
}

function loadCart() {
  const cart = sessionStorage.getItem(SESSION_STORAGE_KEY);
  return JSON.parse(cart) || [];
}

function showCart() {
  cartOverlay.classList.add('transparentBcg');
  cart.classList.add('showCart');
  modalBg.classList.remove('product-active');
}

function renderCartItems() {
  cartQuantity.innerHTML = shoppingCart.length;

  $.ajax({
    url: 'data/products.json',
    success: function (data) {
      const total = shoppingCart.reduce((sum, entry) => {
        const item = data.find(i => entry.id === i.id);
        return sum + item.price * entry.quantity;
      }, 0);

      cartTotal.innerHTML = total;

      let html = '';
      if (shoppingCart.length == 0) {
        html = '<h2>Cart is empty!</h2>';
      } else {
        html = '<h2>Cart</h2>';
      }
      shoppingCart.forEach(entry => {
        const item = data.find(i => entry.id === i.id);
        const quantity = entry.quantity;
        html += printCartItem(item, quantity);
      });
      cartContainer.innerHTML = html;
    },
  });
}

function printCartItem(item, quantity) {
  return `
        <div class="cart-item"  data-id="${item.id}">
              <img src="${item.img}" alt="${item.name}">
              <div>
                <h5>${item.name}</h5>
                <h6 class="cart-price">$${item.price * quantity}</h6>
                <span class="remove-item">remove</span>
              </div>
              <div>
                <i class="fa fa-chevron-up" id="up"></i>
                <p class="item-amount">${quantity}</p>
                <i class="fa fa-chevron-down" id="down"></i>
              </div>
            </div>
        `;
}

$('.clear-cart').click(clearCartAll);

function clearCartAll() {
  shoppingCart = [];
  renderCartItems();
  saveCart();
}

function removeOneProduct(id) {
  const existingItem = shoppingCart.find(entry => entry.id === id);
  if (existingItem == null) return;
  existingItem.quantity--;
  if (existingItem.quantity == 0) {
    removeFromCart(existingItem.id);
  } else {
    renderCartItems();
    saveCart();
  }
}
function addOneProduct(id) {
  const existingItem = shoppingCart.find(entry => entry.id === id);
  if (existingItem == null) return;
  existingItem.quantity++;
  renderCartItems();
  saveCart();
}
