export function formatCurrency(value = 0) {
    return new Intl.NumberFormat("es-EC", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format(Number(value) || 0);
}

export function formatCompactNumber(value = 0) {
    return new Intl.NumberFormat("es-EC", {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(Number(value) || 0);
}

export function formatRelativeLabel(value) {
    if (!value) return "Sin información reciente";
    const date = new Date(value);
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return "Hace unos segundos";
    if (diffMinutes < 60) return `Hace ${diffMinutes} min`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Hace ${diffHours} h`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `Hace ${diffDays} d`;

    return new Intl.DateTimeFormat("es-EC", {
        dateStyle: "medium"
    }).format(date);
}

export function commissionBreakdown(price = 0, commissionRate = 0.1) {
    const total = Number(price) || 0;
    const commission = total * commissionRate;
    const studentReceives = total - commission;

    return {
        total,
        commission,
        studentReceives
    };
}