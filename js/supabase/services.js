import { supabase } from "./client.js";

export async function createService(service = {}) {
    const { data, error } = await supabase
        .from("services")
        .insert(service)
        .select()
        .single();

    return { data, error };
}

export async function getMarketplaceServices() {
    const { data, error } = await supabase
        .from("services")
        .select(`
      *,
      profiles:owner_id (
        id,
        full_name,
        username,
        career
      )
    `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    return { data: data || [], error };
}

export async function getMyServices(ownerId) {
    const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("owner_id", ownerId)
        .order("created_at", { ascending: false });

    return { data: data || [], error };
}

export async function updateService(serviceId, updates = {}) {
    const { data, error } = await supabase
        .from("services")
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq("id", serviceId)
        .select()
        .single();

    return { data, error };
}

export async function deleteService(serviceId) {
    const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", serviceId);

    return { error };
}