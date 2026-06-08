// Pure presentation helper: derives the badge + sold-out display state for a product card.
// Dependency-free, like cart.js / order.js.
export function toCardView(product) {
  const soldOut = product.soldOut === true;
  let badgeText = '';
  let badgeClass = '';
  if (soldOut) {
    badgeText = 'אזל המלאי';
    badgeClass = 'bg-secondary';
  } else if (product.badge) {
    badgeText = product.badge;
    badgeClass = 'bg-danger';
  }
  return { ...product, soldOut, badgeText, badgeClass };
}
