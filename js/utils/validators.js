export function isEmail(value = "") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isStrongPassword(value = "") {
    return typeof value === "string" && value.trim().length >= 8;
}

export function isRequired(value) {
    return String(value ?? "").trim().length > 0;
}

export function validateLoginPayload({ email, password }) {
    if (!isRequired(email)) {
        return { valid: false, message: "Debes ingresar tu correo electrónico." };
    }

    if (!isEmail(email)) {
        return { valid: false, message: "El correo electrónico no es válido." };
    }

    if (!isRequired(password)) {
        return { valid: false, message: "Debes ingresar tu contraseña." };
    }

    return { valid: true, message: "" };
}

export function validateRegisterPayload({
    full_name,
    username,
    email,
    password,
    password_confirm
}) {
    if (!isRequired(full_name)) {
        return { valid: false, message: "Debes ingresar tu nombre completo." };
    }

    if (!isRequired(username)) {
        return { valid: false, message: "Debes definir un nombre de usuario." };
    }

    if (!isEmail(email)) {
        return { valid: false, message: "Debes ingresar un correo válido." };
    }

    if (!isStrongPassword(password)) {
        return { valid: false, message: "La contraseña debe tener al menos 8 caracteres." };
    }

    if (password !== password_confirm) {
        return { valid: false, message: "Las contraseñas no coinciden." };
    }

    return { valid: true, message: "" };
}

export function validateServicePayload({ title, category, price, description }) {
    if (!isRequired(title)) {
        return { valid: false, message: "Debes ingresar el título del servicio." };
    }

    if (!isRequired(category)) {
        return { valid: false, message: "Debes indicar una categoría." };
    }

    if (!Number(price) || Number(price) <= 0) {
        return { valid: false, message: "El precio debe ser mayor que cero." };
    }

    if (!isRequired(description) || description.trim().length < 20) {
        return {
            valid: false,
            message: "La descripción debe tener al menos 20 caracteres."
        };
    }

    return { valid: true, message: "" };
}