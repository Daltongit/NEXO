import { getCurrentSession, onAuthStateChanged, signOutCurrentUser } from "../supabase/auth.js";
import { ensureUserProfile } from "../supabase/users.js";

let authSubscription = null;

export async function getCurrentSessionSafe() {
    try {
        const { session, error } = await getCurrentSession();
        return { session, error };
    } catch (error) {
        return { session: null, error };
    }
}

export async function signOutUserSafe() {
    try {
        const { error } = await signOutCurrentUser();
        return { error };
    } catch (error) {
        return { error };
    }
}

export function initSessionWatcher() {
    if (authSubscription) return authSubscription;

    authSubscription = onAuthStateChanged(async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
            await ensureUserProfile(session.user);

            const isAuthPage = document.body.classList.contains("auth-body");
            if (isAuthPage) {
                window.location.href = "./app.html#dashboard";
            }
        }

        if (event === "SIGNED_OUT") {
            const isAppPage = document.body.classList.contains("app-body");
            if (isAppPage) {
                window.location.href = "./auth.html#login";
            }
        }
    });

    return authSubscription;
}

document.addEventListener("DOMContentLoaded", initSessionWatcher); 
