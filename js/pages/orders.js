import { getCurrentSessionSafe } from "../auth/session.js";
import { getMyOrders } from "../supabase/orders.js";
import { updateState, getState } from "../core/state.js";
import { formatCurrency, formatRelativeLabel } from "../utils/formatters.js";
import { showToast } from "../utils/notifications.js";

function getStatusBadge(status = "") {
    const normalized = status.toLowerCase();

    if (normalized === "completed") {
        return `<span class="status-badge success">Completada</span>`;
    }

    if (normalized === "pending") {
        return `<span class="status-badge warning">Pendiente</span>`;
    }

    if (normalized === "cancelled") {
        return `<span class="status-badge danger">Cancelada</span>`;
    }

    return `<span class="status-badge">En proceso</span>`;
}

function createOrderCard(order) {
    const article = document.createElement("article");
    article.className = "order-card";

    article.innerHTML = `
    <div class="order-card-top">
      <div>
        <h3>${order.service?.title || "Servicio relacionado"}</h3>
        <div class="order-meta">
          <span>${order.service?.category || "General"}</span>
          <span>${formatRelativeLabel(order.created_at)}</span>
        </div>
      </div>
      ${getStatusBadge(order.status || "pending")}
    </div>

    <p>${order.notes || "Orden registrada dentro de la plataforma."}</p>

    <div class="order-card-bottom">
      <strong>${formatCurrency(order.total_price || order.service?.price || 0)}</strong>
      <span class="order-meta">
        <span>Cliente / estudiante vinculados en la orden</span>
      </span>
    </div>
  `;

    return article;
}

function renderOrders() {
    const container = document.getElementById("orders-list");
    if (!container) return;

    const orders = getState().orders || [];
    container.innerHTML = "";

    if (!orders.length) {
        container.innerHTML = `
      <div class="empty-state">
        <h3>No hay órdenes registradas</h3>
        <p>Aquí aparecerán las contrataciones y solicitudes de trabajo.</p>
      </div>
    `;
        return;
    }

    orders.forEach((order) => {
        container.appendChild(createOrderCard(order));
    });
}

async function loadOrders() {
    const { session } = await getCurrentSessionSafe();
    if (!session?.user?.id) return;

    const { data, error } = await getMyOrders(session.user.id);

    if (error) {
        showToast({
            type: "error",
            title: "No fue posible cargar las órdenes",
            message: error.message || "Intenta nuevamente."
        });
        return;
    }

    updateState((state) => {
        state.orders = data || [];
    });

    renderOrders();
}

document.addEventListener("DOMContentLoaded", loadOrders);
document.addEventListener("nexo:route-changed", (event) => {
    if (event.detail.route === "orders") {
        renderOrders();
    }
});