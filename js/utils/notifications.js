let toastCounter = 0;

export function showToast({
    type = "info",
    title = "Notificación",
    message = "",
    duration = 3200
} = {}) {
    const stack = document.getElementById("toast-stack");
    if (!stack) return;

    const toast = document.createElement("article");
    const id = `toast-${++toastCounter}`;

    toast.className = `toast ${type}`;
    toast.id = id;

    const titleElement = document.createElement("strong");
    titleElement.textContent = title;

    const messageElement = document.createElement("p");
    messageElement.textContent = message;

    toast.append(titleElement, messageElement);
    stack.appendChild(toast);

    window.setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(8px)";
        toast.style.transition = "opacity 180ms ease, transform 180ms ease";

        window.setTimeout(() => {
            toast.remove();
        }, 220);
    }, duration);
}