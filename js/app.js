import { products, findProduct } from './products.js';
import { addItem, removeItem, cartTotal, cartCount } from './cart.js';
import { loadCart, saveCart } from './storage.js';

let cart = loadCart();

$(function () {
  // Render the product grid (Mustache over the product array ≈ a Liquid {% for %} loop)
  const cardTpl = document.getElementById('product-card-tpl').innerHTML;
  Mustache.parse(cardTpl);
  $('#product-grid').html(products.map((p) => Mustache.render(cardTpl, p)).join(''));

  // Pre-parse the cart line template
  Mustache.parse(document.getElementById('cart-line-tpl').innerHTML);

  renderCart();

  // Add to cart from the grid
  $('#product-grid').on('click', '.add-to-cart', function () {
    const product = findProduct(String($(this).data('id')));
    if (product) {
      cart = addItem(cart, product);
      persist();
    }
  });

  // Open the quick-view modal
  $('#product-grid').on('click', '.quick-view', function () {
    const product = findProduct(String($(this).data('id')));
    if (!product) return;
    const qvTpl = document.getElementById('quick-view-tpl').innerHTML;
    $('#quick-view-body').html(Mustache.render(qvTpl, product));
    bootstrap.Modal.getOrCreateInstance(document.getElementById('quick-view')).show();
  });

  // Add to cart from the modal (respects the chosen quantity)
  $('#quick-view-body').on('click', '.qv-add', function () {
    const product = findProduct(String($(this).data('id')));
    if (!product) return;
    const qty = Math.max(1, parseInt($('.qv-qty').val(), 10) || 1);
    cart = addItem(cart, product, qty);
    persist();
    bootstrap.Modal.getOrCreateInstance(document.getElementById('quick-view')).hide();
  });

  // Remove a line from the drawer
  $('#cart-lines').on('click', '.remove-line', function () {
    cart = removeItem(cart, String($(this).data('id')));
    persist();
  });

  // Open / close the cart drawer
  $('.cart-btn').on('click', () => $('#cart-drawer').prop('hidden', false));
  $('.close-cart').on('click', () => $('#cart-drawer').prop('hidden', true));
});

function persist() {
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const lineTpl = document.getElementById('cart-line-tpl').innerHTML;
  const lines = cart.map((i) => ({ ...i, lineTotal: i.price * i.qty }));
  $('#cart-lines').html(
    lines.length
      ? lines.map((l) => Mustache.render(lineTpl, l)).join('')
      : '<p class="cart-empty">הסל ריק.</p>'
  );
  $('[data-cart-count]').text(cartCount(cart));
  $('[data-cart-grand]').text(cartTotal(cart));
}
