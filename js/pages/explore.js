import { getMarketplaceServices } from "../supabase/services.js";
import { updateState, getState } from "../core/state.js";
import { formatCurrency } from "../utils/formatters.js";
import { clampText, debounce } from "../utils/helpers.js";

function createServiceCard(service) {
    const owner = service.profiles || {};
    const article = document.createElement("article");
    article.className = "service-card-item";

    article.innerHTML = `
    <div class="service-card-head">
      <div>
        <h3>${service.title || "Servicio sin título"}</h3>
        <p>${owner.full_name || owner.username || "Estudiante"}</p>
      </div>
      <span class="service-price">${formatCurrency(service.price || 0)}</span>
    </div>
    <div class="service-card-meta">
      <span>${service.category || "General"}</span>
      <span>${owner.career || "Especialidad no indicada"}</span>
    </div>
    <p>${clampText(service.description || "Sin descripción disponible.", 180)}</p>
    <div class="service-card-footer">
      <span class="badge">${service.category || "General"}</span>
      <button class="btn btn-secondary" type="button">Solicitar servicio</button>
    </div>
  `;

    return article;
}

function renderExploreServices(filteredServices = []) {
    const container = document.getElementById("explore-services-list");
    if (!container) return;

    container.innerHTML = "";

    if (!filteredServices.length) {
        container.innerHTML = `
      <div class="empty-state">
        <h3>No hay resultados</h3>
        <p>No se encontraron servicios con los filtros actuales.</p>
      </div>
    `;
        return;
    }

    filteredServices.forEach((service) => {
        container.appendChild(createServiceCard(service));
    });
}

function applyExploreFilters() {
    const state = getState();
    const search = document.getElementById("explore-search")?.value?.trim().toLowerCase() || "";
    const category = document.getElementById("explore-category")?.value?.trim().toLowerCase() || "";

    const filtered = state.services.filter((service) => {
        const searchable = [
            service.title,
            service.description,
            service.category,
            service?.profiles?.full_name,
            service?.profiles?.career
        ]
            .join(" ")
            .toLowerCase();

        const matchesSearch = !search || searchable.includes(search);
        const matchesCategory = !category || (service.category || "").toLowerCase().includes(category);

        return matchesSearch && matchesCategory;
    });

    renderExploreServices(filtered);
}

async function loadExploreServices() {
    const body = document.body;
    if (!body.classList.contains("app-body")) return;

    const { data } = await getMarketplaceServices();

    updateState((state) => {
        state.services = data || [];
    });

    applyExploreFilters();
}

function bindExploreFilters() {
    const searchInput = document.getElementById("explore-search");
    const categorySelect = document.getElementById("explore-category");

    const debouncedFilter = debounce(applyExploreFilters, 220);

    searchInput?.addEventListener("input", debouncedFilter);
    categorySelect?.addEventListener("change", applyExploreFilters);
}

document.addEventListener("DOMContentLoaded", () => {
    bindExploreFilters();
    loadExploreServices();
});

document.addEventListener("nexo:route-changed", (event) => {
    if (event.detail.route === "explore") {
        applyExploreFilters();
    }
});