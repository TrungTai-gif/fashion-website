export function formatCurrency(value, locale = 'vi-VN', currency = 'VND') {
    if (!value) return "0 ₫";
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
    }).format(value);
}
