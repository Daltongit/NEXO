import { getCurrentSessionSafe } from "../auth/session.js";
import { getMyServices, createService } from "../supabase/services.js";
import { updateState, getState } from "../core/state.js";
import { validateServicePayload } from "../utils/validators.js";
import { formatCurrency } from "../utils/formatters.js";
import { showToast } from "../utils/notifications.js";
import { clampText } from "../utils/helpers.js";

function createMyServiceCard(service) {
    const article = document.createElement("article");
    article.className = "service-card-item";

    article.innerHTML = `
    <div class="service-card-head">
      <div>
        <h3>${service.title}</h3>
        <p>${service.category || "General"}</p>
      </div>
      <span class="service-price">${formatCurrency(service.price || 0)}</span>
    </div>
    <p>${clampText(service.description || "", 180)}</p>
    <div class="service-card-footer">
      <span class="badge">${service.is_active ? "Activo" : "Borrador"}</span>
      <button class="btn btn-secondary" type="button">Administrar</button>
    </div>
  `;

    return article;
}

function renderMyServices() {
    const container = document.getElementById("my-services-list");
    if (!container) return;

    const services = getState().myServices || [];
    container.innerHTML = "";

    if (!services.length) {
        container.innerHTML = `
      <div class="empty-state">
        <h3>Aún no publicas servicios</h3>
        <p>Crea tu primer servicio para aparecer dentro de la plataforma.</p>
      </div>
    `;
        return;
    }

    services.forEach((service) => {
        container.appendChild(createMyServiceCard(service));
    });
}

async function loadMyServices() {
    const { session } = await getCurrentSessionSafe();
    if (!session?.user?.id) return;

    const { data, error } = await getMyServices(session.user.id);

    if (error) {
        showToast({
            type: "error",
            title: "No fue posible cargar tus servicios",
            message: error.message || "Intenta nuevamente."
        });
        return;
    }

    updateState((state) => {
        state.myServices = data || [];
    });

    renderMyServices();
}

async function handleCreateService(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
        title: String(formData.get("title") || "").trim(),
        category: String(formData.get("category") || "").trim(),
        price: Number(formData.get("price") || 0),
        description: String(formData.get("description") || "").trim()
    };

    const validation = validateServicePayload(payload);
    if (!validation.valid) {
        showToast({
            type: "error",
            title: "Formulario inválido",
            message: validation.message
        });
        return;
    }

    const { session } = await getCurrentSessionSafe();
    if (!session?.user?.id) return;

    const servicePayload = {
        owner_id: session.user.id,
        title: payload.title,
        category: payload.category,
        price: payload.price,
        description: payload.description,
        is_active: true
    };

    const { data, error } = await createService(servicePayload);

    if (error) {
        showToast({
            type: "error",
            title: "No fue posible crear el servicio",
            message: error.message || "Revisa la configuración de tu base."
        });
        return;
    }

    updateState((state) => {
        state.myServices.unshift(data);
    });

    renderMyServices();
    form.reset();

    const modal = document.getElementById("service-modal");
    if (modal) {
        modal.hidden = true;
        document.body.style.overflow = "";
    }

    showToast({
        type: "success",
        title: "Servicio publicado",
        message: "Tu servicio ya aparece en tu panel."
    });
}

function bindServiceForm() {
    const serviceForm = document.getElementById("service-form");
    if (!serviceForm) return;
    serviceForm.addEventListener("submit", handleCreateService);
}

document.addEventListener("DOMContentLoaded", () => {
    bindServiceForm();
    loadMyServices();
});

document.addEventListener("nexo:route-changed", (event) => {
    if (event.detail.route === "my-services") {
        renderMyServices();
    }
});