export const products = [];
export function findProduct(id) {
  return products.find((p) => p.id === id) || null;
}
