import { getCurrentSessionSafe } from "../auth/session.js";
import { getMyProfile, updateMyProfile } from "../supabase/users.js";
import { updateState, getState } from "../core/state.js";
import { showToast } from "../utils/notifications.js";

function fillProfileForm(profile = {}) {
    const fields = {
        "profile-full-name": profile.full_name || "",
        "profile-username": profile.username || "",
        "profile-career": profile.career || "",
        "profile-phone": profile.phone || "",
        "profile-bio": profile.bio || ""
    };

    Object.entries(fields).forEach(([id, value]) => {
        const field = document.getElementById(id);
        if (field) field.value = value;
    });
}

async function loadProfile() {
    const { session } = await getCurrentSessionSafe();
    if (!session?.user?.id) return;

    const { data, error } = await getMyProfile(session.user.id);

    if (error) {
        showToast({
            type: "error",
            title: "No fue posible cargar el perfil",
            message: error.message || "Intenta nuevamente."
        });
        return;
    }

    updateState((state) => {
        state.profile = data || null;
    });

    fillProfileForm(data || {});
}

async function handleProfileSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
        full_name: String(formData.get("full_name") || "").trim(),
        username: String(formData.get("username") || "").trim(),
        career: String(formData.get("career") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        bio: String(formData.get("bio") || "").trim()
    };

    const { session } = await getCurrentSessionSafe();
    if (!session?.user?.id) return;

    const { data, error } = await updateMyProfile(session.user.id, payload);

    if (error) {
        showToast({
            type: "error",
            title: "No fue posible actualizar el perfil",
            message: error.message || "Intenta nuevamente."
        });
        return;
    }

    updateState((state) => {
        state.profile = data;
    });

    showToast({
        type: "success",
        title: "Perfil actualizado",
        message: "Tus datos se guardaron correctamente."
    });
}

function bindProfileForm() {
    const form = document.getElementById("profile-form");
    if (!form) return;
    form.addEventListener("submit", handleProfileSubmit);
}

document.addEventListener("DOMContentLoaded", () => {
    bindProfileForm();
    loadProfile();
});

document.addEventListener("nexo:route-changed", (event) => {
    if (event.detail.route === "profile") {
        fillProfileForm(getState().profile || {});
    }
});