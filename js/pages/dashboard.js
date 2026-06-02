import { updateState, getState } from "../core/state.js";
import { getCurrentSessionSafe } from "../auth/session.js";
import { getMyProfile } from "../supabase/users.js";
import { getMyServices } from "../supabase/services.js";
import { getMyOrders } from "../supabase/orders.js";
import { getReviewsForUser } from "../supabase/reviews.js";
import { hydrateTopbarUser } from "../core/app.js";
import { formatCurrency } from "../utils/formatters.js";

async function loadDashboardData() {
    const body = document.body;
    if (!body.classList.contains("app-body")) return;

    const { session } = await getCurrentSessionSafe();
    if (!session?.user?.id) return;

    const userId = session.user.id;

    const [profileResult, myServicesResult, ordersResult, reviewsResult] = await Promise.all([
        getMyProfile(userId),
        getMyServices(userId),
        getMyOrders(userId),
        getReviewsForUser(userId)
    ]);

    updateState((state) => {
        state.profile = profileResult.data || null;
        state.myServices = myServicesResult.data || [];
        state.orders = ordersResult.data || [];
        state.reviews = reviewsResult.data || [];
    });

    hydrateTopbarUser(profileResult.data || session.user.user_metadata || {}, session);
    populateDashboard();
}

function calculateAverageRating(reviews = []) {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
    return total / reviews.length;
}

function calculateEstimatedEarnings(orders = []) {
    const completedOrders = orders.filter((order) => order.status === "completed");
    const gross = completedOrders.reduce((sum, order) => sum + Number(order.total_price || 0), 0);
    return gross * 0.9;
}

export function populateDashboard() {
    const state = getState();

    const servicesCount = state.myServices.length;
    const ordersInProgress = state.orders.filter((order) =>
        ["pending", "in_progress"].includes(order.status)
    ).length;
    const averageRating = calculateAverageRating(state.reviews);
    const earnings = calculateEstimatedEarnings(state.orders);

    const kpiServices = document.getElementById("kpi-services");
    const kpiOrders = document.getElementById("kpi-orders");
    const kpiRating = document.getElementById("kpi-rating");
    const kpiEarnings = document.getElementById("kpi-earnings");

    if (kpiServices) kpiServices.textContent = String(servicesCount);
    if (kpiOrders) kpiOrders.textContent = String(ordersInProgress);
    if (kpiRating) kpiRating.textContent = averageRating.toFixed(1);
    if (kpiEarnings) kpiEarnings.textContent = formatCurrency(earnings);

    const profile = state.profile || {};
    const summaryName = document.getElementById("summary-name");
    const summaryUsername = document.getElementById("summary-username");
    const summaryCareer = document.getElementById("summary-career");
    const summaryBio = document.getElementById("summary-bio");

    if (summaryName) summaryName.textContent = profile.full_name || "Sin definir";
    if (summaryUsername) summaryUsername.textContent = profile.username ? `@${profile.username}` : "@usuario";
    if (summaryCareer) summaryCareer.textContent = profile.career || "No especificada";
    if (summaryBio) {
        summaryBio.textContent = profile.bio || "Completa tu perfil para fortalecer tu presencia profesional.";
    }
}

document.addEventListener("DOMContentLoaded", loadDashboardData);
document.addEventListener("nexo:route-changed", (event) => {
    if (event.detail.route === "dashboard") {
        populateDashboard();
    }
});