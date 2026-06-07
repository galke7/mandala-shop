import { products, findProduct } from './products.js';
import { addItem, removeItem, cartTotal, cartCount } from './cart.js';
import { loadCart, saveCart } from './storage.js';
import { validateOrderForm } from './validation.js';
import { buildOrderPayload } from './order.js';

// Web3Forms access key — public by design (it's an alias for the recipient inbox).
// Currently delivers to gal.kerem@gmail.com (soft-launch). Flip the key's recipient to
// margalitag@gmail.com in the Web3Forms dashboard once Margalit approves go-live.
const ACCESS_KEY = '24273511-b70f-4f03-8c54-291465b562ea';

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

  // Open / close the cart drawer; jump to the order form from the drawer
  $('.cart-btn').on('click', () => $('#cart-drawer').prop('hidden', false));
  $('.close-cart').on('click', () => $('#cart-drawer').prop('hidden', true));
  $('#go-to-order').on('click', () => $('#cart-drawer').prop('hidden', true));

  // Submit the order to Web3Forms
  $('#order-form').on('submit', function (e) {
    e.preventDefault();
    const form = this;
    $('#order-status').text('');        // clear any stale status
    $('.field-error', form).text('');   // clear old errors (scoped to this form)
    const customer = {
      name: $('#name').val().trim(),
      email: $('#email').val().trim(),
      phone: $('#phone').val().trim(),
      address: $('#address').val().trim(),
      note: $('#note').val().trim(),
    };
    const { valid, errors } = validateOrderForm(customer);
    if (!valid) {
      Object.entries(errors).forEach(([field, msg]) =>
        $(`[data-error-for="${field}"]`).text(msg)
      );
      return;
    }
    if (cart.length === 0) {
      $('#order-status').text('הסל ריק — נא להוסיף מוצרים לפני שליחת ההזמנה.');
      return;
    }
    const payload = buildOrderPayload(cart, customer, ACCESS_KEY);
    const $btn = $('button[type="submit"]', form).prop('disabled', true);
    $('#order-status').text('שולח...');
    $.ajax({
      url: 'https://api.web3forms.com/submit',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(payload),
      dataType: 'json',
    })
      .done((data) => {
        if (!data || !data.success) {
          $('#order-status').text('אירעה שגיאה בשליחה. נסו שוב.');
          return;
        }
        $('#order-status').text('ההזמנה נשלחה! נחזור אליך בקרוב 🧶');
        cart = [];
        saveCart(cart);
        renderCart();
        form.reset();
      })
      .fail(() => $('#order-status').text('אירעה שגיאה בשליחה. נסו שוב.'))
      .always(() => $btn.prop('disabled', false));
  });
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
