// Shape: { id, name, price, salePrice?, image, badge?, desc }  — salePrice & badge are optional.
export const products = [
  { id: 'p1', name: 'מנדלה פרח 20 ס״מ', price: 320, image: 'images/20cm-IMG_20260605_142333.jpg', desc: 'מנדלה פרח סרוגה בעבודת יד עם מספר שכבות, קוטר כ-20 ס״מ.' },
  { id: 'p2', name: 'מנדלה לוכד חלומות על מסגרת עץ 20 ס״מ', price: 270, badge: 'מבצע', salePrice: 240, image: 'images/20cm-wooden-IMG_20260605_142713.jpg', desc: 'מנדלה לוכד חלומות סרוגה מתוחה על מסגרת עץ, קוטר כ-20 ס״מ.' },
  { id: 'p3', name: 'מנדלה על מסגרת עץ 20 ס״מ', price: 270, badge: 'מבצע', salePrice: 240, image: 'images/20cm-wooden-IMG_20260605_143127.jpg', desc: 'מנדלה סרוגה על מסגרת עץ בגוון שונה, קוטר כ-20 ס״מ.' },
  { id: 'p4', name: 'מנדלה תלת-ממד  25 ס״מ', price: 300, image: 'images/25cm-IMG_20260605_143026.jpg', desc: 'מנדלה תלת-ממד סרוגה במספר שכבות בעבודת יד, קוטר כ-25 ס״מ.' },
  { id: 'p5', name: 'מנדלה מיקס צבעים 35 ס״מ', price: 320, image: 'images/34cm-IMG_20260605_142832.jpg', desc: 'מנדלה עם צמר בצבעים משתנים סרוגה בעבודת יד, קוטר כ-35 ס״מ.' },
  { id: 'p6', name: 'מנדלה ענקית מהממת 60 ס״מ', price: 400, image: 'images/60cm-IMG_20260605_142604.jpg', desc: 'מנדלה ענקית מהממת סרוגה בעבודת יד, קוטר כ-60 ס״מ.' },
];

export function findProduct(id) {
  return products.find((p) => p.id === id) || null;
}
