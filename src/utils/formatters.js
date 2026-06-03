export function formatCurrency(value) {
  const amount = Number.parseFloat(value || 0);
  return `\u20b9${amount.toFixed(2)}`;
}
