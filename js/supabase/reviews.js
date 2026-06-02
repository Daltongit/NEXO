import { supabase } from "./client.js";

export async function getReviewsForUser(userId) {
    const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("reviewed_user_id", userId)
        .order("created_at", { ascending: false });

    return { data: data || [], error };
}

export async function createReview(reviewPayload = {}) {
    const { data, error } = await supabase
        .from("reviews")
        .insert(reviewPayload)
        .select()
        .single();

    return { data, error };
}