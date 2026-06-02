import { setState, getState } from "./state.js";

const DEFAULT_ROUTE = "dashboard";
const AVAILABLE_ROUTES = [
    "dashboard",
    "explore",
    "my-services",
    "orders",
    "messages",
    "portfolio",
    "reviews",
    "profile",
    "settings"
];

function normalizeRoute(hashValue = "") {
    const route = hashValue.replace(/^#/, "").trim();
    if (!route) return DEFAULT_ROUTE;
    return AVAILABLE_ROUTES.includes(route) ? route : DEFAULT_ROUTE;
}

export function getCurrentRouteFromHash() {
    return normalizeRoute(window.location.hash);
}

export function navigateTo(route) {
    const normalizedRoute = normalizeRoute(route);
    window.location.hash = normalizedRoute;
}

export function renderRoute() {
    const route = getCurrentRouteFromHash();
    const state = getState();

    setState({ currentRoute: route });

    document.querySelectorAll("[data-route-panel]").forEach((panel) => {
        const panelRoute = panel.getAttribute("data-route-panel");
        const isActive = panelRoute === route;
        panel.hidden = !isActive;
        panel.classList.toggle("active", isActive);
    });

    document.querySelectorAll("[data-route]").forEach((button) => {
        const buttonRoute = button.getAttribute("data-route");
        const isActive = buttonRoute === route;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-current", isActive ? "page" : "false");
    });

    document.querySelectorAll("[data-route-action]").forEach((button) => {
        button.addEventListener("click", () => {
            const targetRoute = button.getAttribute("data-route-action");
            navigateTo(targetRoute);
        });
    });

    const pageTitle = document.getElementById("page-title");
    if (pageTitle) {
        pageTitle.textContent = getRouteLabel(route);
    }

    if (state.ui.sidebarOpen) {
        document.body.classList.remove("sidebar-open");
        state.ui.sidebarOpen = false;
    }

    document.dispatchEvent(
        new CustomEvent("nexo:route-changed", {
            detail: { route }
        })
    );
}

export function getRouteLabel(route) {
    const labels = {
        dashboard: "Resumen general",
        explore: "Explorar servicios",
        "my-services": "Mis servicios",
        orders: "Órdenes",
        messages: "Mensajes",
        portfolio: "Portafolio",
        reviews: "Reseñas",
        profile: "Perfil",
        settings: "Ajustes"
    };

    return labels[route] || "Panel principal";
}

export function initRouter() {
    document.querySelectorAll("[data-route]").forEach((button) => {
        button.addEventListener("click", () => {
            const route = button.getAttribute("data-route");
            navigateTo(route);
        });
    });

    window.addEventListener("hashchange", renderRoute);

    if (!window.location.hash) {
        window.location.hash = DEFAULT_ROUTE;
    } else {
        renderRoute();
    }
}