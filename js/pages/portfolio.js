import { updateState, getState } from "../core/state.js";
import { showToast } from "../utils/notifications.js";
import { clampText } from "../utils/helpers.js";

function renderPortfolio() {
    const container = document.getElementById("portfolio-list");
    if (!container) return;

    const items = getState().portfolio || [];
    container.innerHTML = "";

    if (!items.length) {
        container.innerHTML = `
      <div class="empty-state">
        <h3>Portafolio vacío</h3>
        <p>Agrega proyectos o muestras para fortalecer tu perfil profesional.</p>
      </div>
    `;
        return;
    }

    items.forEach((item) => {
        const article = document.createElement("article");
        article.className = "portfolio-card";
        article.innerHTML = `
      <h3>${item.title}</h3>
      <p>${clampText(item.description, 160)}</p>
      <div class="service-card-footer">
        <span class="badge">${item.type || "Proyecto"}</span>
      </div>
    `;
        container.appendChild(article);
    });
}

function bindPortfolioButton() {
    const button = document.getElementById("add-portfolio-item");
    if (!button) return;

    button.addEventListener("click", () => {
        const demoItem = {
            id: crypto.randomUUID(),
            title: "Proyecto destacado",
            description: "Ejemplo inicial de portafolio agregado desde la interfaz.",
            type: "Muestra"
        };

        updateState((state) => {
            state.portfolio.unshift(demoItem);
        });

        renderPortfolio();

        showToast({
            type: "success",
            title: "Elemento agregado",
            message: "Se añadió un ejemplo de portafolio en memoria."
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    bindPortfolioButton();
    renderPortfolio();
});

document.addEventListener("nexo:route-changed", (event) => {
    if (event.detail.route === "portfolio") {
        renderPortfolio();
    }
});