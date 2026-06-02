import { supabase } from "./client.js";

export async function signUpWithEmail({
    email,
    password,
    full_name,
    username,
    career,
    bio
}) {
    const payload = {
        email,
        password,
        options: {
            data: {
                full_name,
                username,
                career: career || "",
                bio: bio || ""
            }
        }
    };

    const { data, error } = await supabase.auth.signUp(payload);
    return { data, error };
}

export async function signInWithEmail({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    return { data, error };
}

export async function signOutCurrentUser() {
    const { error } = await supabase.auth.signOut();
    return { error };
}

export async function getCurrentSession() {
    const { data, error } = await supabase.auth.getSession();
    return { session: data?.session ?? null, error };
}

export async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    return { user: data?.user ?? null, error };
}

export function onAuthStateChanged(callback) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (typeof callback === "function") {
            callback(event, session);
        }
    });

    return data?.subscription;
}