export function $(selector, parent = document) {
    return parent.querySelector(selector);
}

export function $all(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
}

export function getInitials(value = "") {
    if (!value) return "N";
    const parts = value.trim().split(/\s+/).slice(0, 2);
    return parts.map((part) => part.charAt(0).toUpperCase()).join("") || "N";
}

export function slugify(value = "") {
    return value
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export function currency(value = 0, locale = "es-EC", code = "USD") {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: code,
        maximumFractionDigits: 2
    }).format(Number(value) || 0);
}

export function formatDate(value) {
    if (!value) return "Sin fecha";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Fecha inválida";

    return new Intl.DateTimeFormat("es-EC", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(date);
}

export function toggleHidden(element, shouldHide = true) {
    if (!element) return;
    element.hidden = shouldHide;
}

export function createElement(tag, className = "", content = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.textContent = content;
    return element;
}

export function debounce(callback, delay = 250) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback(...args), delay);
    };
}

export function clampText(text = "", maxLength = 120) {
    if (!text || text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trim()}...`;
}

export function safeJsonParse(value, fallback = null) {
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}