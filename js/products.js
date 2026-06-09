// Shape: { id, name, price, salePrice?, image, badge?, soldOut?, desc }
// salePrice/badge/soldOut are optional. soldOut: true → "אזל המלאי" badge + cannot be added to cart.
export const products = [
  { id: 'p1', name: 'מנדלה פרח 20 ס״מ', price: 320, image: 'images/20cm-IMG_20260605_142333.jpg', desc: 'מנדלה פרח סרוגה בעבודת יד עם מספר שכבות, קוטר כ-20 ס״מ.' },
  { id: 'p2', name: 'מנדלה לוכד חלומות על מסגרת עץ 20 ס״מ', price: 270, badge: 'מבצע', salePrice: 240, image: 'images/20cm-wooden-IMG_20260605_142713.jpg', desc: 'מנדלה לוכד חלומות סרוגה מתוחה על מסגרת עץ, קוטר כ-20 ס״מ.' },
  { id: 'p3', name: 'מנדלה על מסגרת עץ 20 ס״מ', price: 270, badge: 'מבצע', salePrice: 240, image: 'images/20cm-wooden-IMG_20260605_143127.jpg', desc: 'מנדלה סרוגה על מסגרת עץ בגוון שונה, קוטר כ-20 ס״מ.' },
  { id: 'p4', name: 'מנדלה תלת-ממד  25 ס״מ', price: 300, image: 'images/25cm-IMG_20260605_143026.jpg', desc: 'מנדלה תלת-ממד סרוגה במספר שכבות בעבודת יד, קוטר כ-25 ס״מ.' },
  { id: 'p6', name: 'מנדלה ענקית מהממת 60 ס״מ', price: 400, image: 'images/60cm-IMG_20260605_142604.jpg', desc: 'מנדלה ענקית מהממת סרוגה בעבודת יד, קוטר כ-60 ס״מ.' },
  { id: 'p7', name: 'מנדלת פתיתי שלג 35 ס״מ', price: 320, image: 'images/35cm-p7.jpg', desc: 'מנדלת פתיתי שלג סרוגה בעבודת יד, קוטר כ-35 ס״מ.' },
  { id: 'p8', name: 'מנדלת ענווה 30 ס״מ', price: 300, image: 'images/30cm-p8.jpg', desc: 'מנדלת ענווה סרוגה בעבודת יד, קוטר כ-30 ס״מ. זמין במלאי.' },
  { id: 'p9', name: 'מנדלה לבנה 35 ס״מ', price: 320, image: 'images/35cm-p9.jpg', desc: 'מנדלה לבנה סרוגה בעבודת יד, קוטר כ-35 ס״מ.' },
  { id: 'p10', name: 'מנדלת שמחה 50 ס״מ', price: 400, image: 'images/50cm-p10.jpg', desc: 'מנדלת שמחה סרוגה בעבודת יד, קוטר כ-50 ס״מ.' },
  { id: 'p11', name: 'מנדלת שמחה 50 ס״מ', price: 400, image: 'images/50cm-p11.jpg', desc: 'מנדלת שמחה סרוגה בעבודת יד, קוטר כ-50 ס״מ.' },
];

export function findProduct(id) {
  return products.find((p) => p.id === id) || null;
}
