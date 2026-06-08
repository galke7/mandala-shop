export function addItem(cart, product, qty = 1) {
  if (product.soldOut) return cart;
  const price = product.salePrice ?? product.price;
  if (cart.some((i) => i.id === product.id)) {
    return cart.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
  }
  return [...cart, { id: product.id, name: product.name, price, qty }];
}

export function removeItem(cart, id) {
  return cart.filter((i) => i.id !== id);
}

export function setQty(cart, id, qty) {
  if (qty <= 0) return cart.filter((i) => i.id !== id);
  return cart.map((i) => (i.id === id ? { ...i, qty } : i));
}

export function lineTotal(item) {
  return item.price * item.qty;
}

export function cartTotal(cart) {
  return cart.reduce((sum, i) => sum + lineTotal(i), 0);
}

export function cartCount(cart) {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}
