import { signUpWithEmail } from "../supabase/auth.js";
import { validateRegisterPayload } from "../utils/validators.js";

function setStatus(message = "", type = "") {
    const status = document.getElementById("auth-status");
    if (!status) return;

    status.textContent = message;
    status.classList.remove("is-error", "is-success");

    if (type) {
        status.classList.add(type === "error" ? "is-error" : "is-success");
    }
}

function setLoading(form, isLoading) {
    const submitButton = form?.querySelector('button[type="submit"]');
    if (!submitButton) return;

    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? "Creando cuenta..." : "Crear cuenta";
}

async function handleRegisterSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
        full_name: String(formData.get("full_name") || "").trim(),
        username: String(formData.get("username") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        career: String(formData.get("career") || "").trim(),
        password: String(formData.get("password") || ""),
        password_confirm: String(formData.get("password_confirm") || ""),
        bio: String(formData.get("bio") || "").trim()
    };

    const validation = validateRegisterPayload(payload);

    if (!validation.valid) {
        setStatus(validation.message, "error");
        return;
    }

    setLoading(form, true);
    setStatus("Creando cuenta...", "success");

    const { data, error } = await signUpWithEmail(payload);

    if (error) {
        setLoading(form, false);
        setStatus(error.message || "No fue posible crear la cuenta.", "error");
        return;
    }

    if (data?.user) {
        setStatus(
            "Cuenta creada correctamente. Revisa tu correo si tu proyecto exige confirmación por email.",
            "success"
        );

        form.reset();
        setLoading(form, false);
        return;
    }

    setLoading(form, false);
    setStatus("No fue posible completar el registro.", "error");
}

export function initRegister() {
    const body = document.body;
    if (!body.classList.contains("auth-body")) return;

    const registerForm = document.getElementById("register-form");
    if (!registerForm) return;

    registerForm.addEventListener("submit", handleRegisterSubmit);
}

document.addEventListener("DOMContentLoaded", initRegister);