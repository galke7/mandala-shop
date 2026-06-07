import { lineTotal, cartTotal } from './cart.js';

export function formatOrderSummary(cart, customer) {
  const lines = cart
    .map((item) => `${item.name} x${item.qty} = ${lineTotal(item)} ₪`)
    .join('\n');
  return [
    'הזמנה חדשה:',
    lines,
    `סה"כ לתשלום: ${cartTotal(cart)} ₪`,
    '',
    'פרטי הלקוח/ה:',
    `שם: ${customer.name}`,
    `טלפון: ${customer.phone}`,
    `אימייל: ${customer.email}`,
    `כתובת למשלוח: ${customer.address}`,
    customer.note ? `הערות: ${customer.note}` : '',
  ].join('\n');
}

export function buildOrderPayload(cart, customer, accessKey) {
  return {
    access_key: accessKey,
    subject: `הזמנה חדשה מ-${customer.name}`,
    from_name: customer.name,
    replyto: customer.email,
    message: formatOrderSummary(cart, customer),
  };
}
