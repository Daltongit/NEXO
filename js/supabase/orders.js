import { supabase } from "./client.js";

export async function createOrder(orderPayload = {}) {
    const { data, error } = await supabase
        .from("orders")
        .insert(orderPayload)
        .select()
        .single();

    return { data, error };
}

export async function getMyOrders(userId) {
    const { data, error } = await supabase
        .from("orders")
        .select(`
      *,
      service:service_id (
        id,
        title,
        category,
        price
      )
    `)
        .or(`student_id.eq.${userId},client_id.eq.${userId}`)
        .order("created_at", { ascending: false });

    return { data: data || [], error };
}

export async function updateOrderStatus(orderId, status) {
    const { data, error } = await supabase
        .from("orders")
        .update({
            status,
            updated_at: new Date().toISOString()
        })
        .eq("id", orderId)
        .select()
        .single();

    return { data, error };
}