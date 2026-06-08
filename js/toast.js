// Pure, dependency-free (like cart.js / order.js). Builds the add-to-cart toast message.
export function addedToCartMessage(product) {
  const name = product && typeof product.name === 'string' ? product.name.trim() : '';
  return name ? `נוסף לסל: ${name} ✓` : 'נוסף לסל ✓';
}
