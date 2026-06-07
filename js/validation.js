export function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export function validateOrderForm({ name, email, phone, address }) {
  const errors = {};
  if (!name || !name.trim()) errors.name = 'נא למלא שם';
  if (!isValidEmail(email)) errors.email = 'כתובת אימייל לא תקינה';
  if (!phone || !phone.trim()) errors.phone = 'נא למלא מספר טלפון';
  if (!address || !address.trim()) errors.address = 'נא למלא כתובת למשלוח';
  return { valid: Object.keys(errors).length === 0, errors };
}
