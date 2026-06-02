import { supabase } from "./client.js";

export async function getMyConversations(userId) {
    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order("created_at", { ascending: true });

    return { data: data || [], error };
}

export async function sendMessage(messagePayload = {}) {
    const { data, error } = await supabase
        .from("messages")
        .insert(messagePayload)
        .select()
        .single();

    return { data, error };
}