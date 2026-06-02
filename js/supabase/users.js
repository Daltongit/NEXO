import { supabase } from "./client.js";

export async function ensureUserProfile(user) {
    if (!user?.id) {
        return { data: null, error: new Error("Usuario no válido para crear perfil.") };
    }

    const metadata = user.user_metadata || {};

    const profilePayload = {
        id: user.id,
        email: user.email,
        full_name: metadata.full_name || "",
        username: metadata.username || "",
        career: metadata.career || "",
        bio: metadata.bio || "",
        phone: metadata.phone || "",
        avatar_url: metadata.avatar_url || ""
    };

    const { data, error } = await supabase
        .from("profiles")
        .upsert(profilePayload, { onConflict: "id" })
        .select()
        .single();

    return { data, error };
}

export async function getMyProfile(userId) {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    return { data, error };
}

export async function updateMyProfile(userId, updates = {}) {
    const payload = {
        ...updates,
        updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", userId)
        .select()
        .single();

    return { data, error };
}

export async function listPublicProfiles() {
    const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, username, career, bio, avatar_url")
        .order("created_at", { ascending: false });

    return { data: data || [], error };
}