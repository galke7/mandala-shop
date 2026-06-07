// Shape: { id, name, price, salePrice?, image, badge?, desc }  — salePrice & badge are optional.
export const products = [
  { id: 'p1', name: 'מנדלה סרוגה 20 ס״מ', price: 150, badge: 'מבצע', salePrice: 120, image: 'images/20cm-IMG_20260605_142333.jpg', desc: 'מנדלה סרוגה בעבודת יד, קוטר כ-20 ס״מ.' },
  { id: 'p2', name: 'מנדלה על מסגרת עץ 20 ס״מ', price: 170, image: 'images/20cm-wooden-IMG_20260605_142713.jpg', desc: 'מנדלה סרוגה מתוחה על מסגרת עץ, קוטר כ-20 ס״מ.' },
  { id: 'p3', name: 'מנדלה על מסגרת עץ 20 ס״מ — דגם ב׳', price: 170, image: 'images/20cm-wooden-IMG_20260605_143127.jpg', desc: 'מנדלה סרוגה על מסגרת עץ בגוון שונה, קוטר כ-20 ס״מ.' },
  { id: 'p4', name: 'מנדלה סרוגה 25 ס״מ', price: 180, image: 'images/25cm-IMG_20260605_143026.jpg', desc: 'מנדלה סרוגה בעבודת יד, קוטר כ-25 ס״מ.' },
  { id: 'p5', name: 'מנדלה סרוגה 34 ס״מ', price: 230, image: 'images/34cm-IMG_20260605_142832.jpg', desc: 'מנדלה סרוגה בעבודת יד, קוטר כ-34 ס״מ.' },
  { id: 'p6', name: 'מנדלה סרוגה 60 ס״מ', price: 350, image: 'images/60cm-IMG_20260605_142604.jpg', desc: 'מנדלה סרוגה גדולה בעבודת יד, קוטר כ-60 ס״מ.' },
];

export function findProduct(id) {
  return products.find((p) => p.id === id) || null;
}
