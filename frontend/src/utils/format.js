/**
 * Formatea un número como pesos colombianos
 * Ejemplo: 35000 → "$ 35.000"
 */
export const formatCOP = (amount) =>
    new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
