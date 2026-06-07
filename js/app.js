import { products } from './products.js';

$(function () {
  const tpl = document.getElementById('product-card-tpl').innerHTML;
  Mustache.parse(tpl); // pre-parse for speed
  const html = products.map((p) => Mustache.render(tpl, p)).join('');
  $('#product-grid').html(html);
});
