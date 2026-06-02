import { getCurrentSessionSafe } from "../auth/session.js";
import { getMyConversations, sendMessage } from "../supabase/messages.js";
import { updateState, getState } from "../core/state.js";
import { formatRelativeLabel } from "../utils/formatters.js";
import { showToast } from "../utils/notifications.js";
import { clampText } from "../utils/helpers.js";

function groupConversations(messages = [], currentUserId) {
    const map = new Map();

    messages.forEach((message) => {
        const partnerId =
            message.sender_id === currentUserId ? message.receiver_id : message.sender_id;

        const existing = map.get(partnerId);

        if (!existing || new Date(message.created_at) > new Date(existing.last_message_at)) {
            map.set(partnerId, {
                id: partnerId,
                partnerId,
                title: message.partner_name || "Conversación",
                last_message: message.content || "",
                last_message_at: message.created_at,
                messages: []
            });
        }
    });

    messages.forEach((message) => {
        const partnerId =
            message.sender_id === currentUserId ? message.receiver_id : message.sender_id;

        if (map.has(partnerId)) {
            map.get(partnerId).messages.push(message);
        }
    });

    return [...map.values()].sort(
        (a, b) => new Date(b.last_message_at) - new Date(a.last_message_at)
    );
}

function renderConversationList() {
    const container = document.getElementById("conversation-list");
    if (!container) return;

    const state = getState();
    const conversations = state.conversations || [];

    container.innerHTML = "";

    if (!conversations.length) {
        container.innerHTML = `
      <div class="empty-state">
        <h3>Sin conversaciones</h3>
        <p>Cuando intercambies mensajes, aparecerán aquí.</p>
      </div>
    `;
        return;
    }

    conversations.forEach((conversation) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "conversation-item";
        if (conversation.id === state.selectedConversationId) {
            button.classList.add("active");
        }

        button.innerHTML = `
      <strong>${conversation.title || "Conversación"}</strong>
      <p>${clampText(conversation.last_message || "Sin mensajes.", 70)}</p>
      <small>${formatRelativeLabel(conversation.last_message_at)}</small>
    `;

        button.addEventListener("click", () => {
            updateState((state) => {
                state.selectedConversationId = conversation.id;
            });
            renderActiveConversation();
            renderConversationList();
        });

        container.appendChild(button);
    });
}

function renderActiveConversation() {
    const title = document.getElementById("conversation-title");
    const messagesContainer = document.getElementById("conversation-messages");
    if (!title || !messagesContainer) return;

    const state = getState();
    const activeConversation = state.conversations.find(
        (conversation) => conversation.id === state.selectedConversationId
    );

    if (!activeConversation) {
        title.textContent = "Selecciona una conversación";
        messagesContainer.innerHTML = `
      <div class="empty-state">
        <h3>Sin conversación activa</h3>
        <p>Selecciona una conversación existente para ver sus mensajes.</p>
      </div>
    `;
        return;
    }

    title.textContent = activeConversation.title || "Conversación";
    messagesContainer.innerHTML = "";

    activeConversation.messages.forEach((message) => {
        const bubble = document.createElement("article");
        const isSelf = message.sender_id === getState().currentUser?.id;
        bubble.className = `message-bubble ${isSelf ? "self" : "other"}`;
        bubble.textContent = message.content || "";
        messagesContainer.appendChild(bubble);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function loadMessages() {
    const { session } = await getCurrentSessionSafe();
    if (!session?.user?.id) return;

    const { data, error } = await getMyConversations(session.user.id);

    if (error) {
        showToast({
            type: "error",
            title: "No fue posible cargar los mensajes",
            message: error.message || "Intenta nuevamente."
        });
        return;
    }

    const grouped = groupConversations(data || [], session.user.id);

    updateState((state) => {
        state.currentUser = session.user;
        state.messages = data || [];
        state.conversations = grouped;
        state.selectedConversationId = grouped[0]?.id || null;
    });

    renderConversationList();
    renderActiveConversation();
}

async function handleMessageSubmit(event) {
    event.preventDefault();

    const input = document.getElementById("message-input");
    const content = input?.value?.trim();

    if (!content) return;

    const state = getState();
    const activeConversation = state.conversations.find(
        (conversation) => conversation.id === state.selectedConversationId
    );

    if (!activeConversation) {
        showToast({
            type: "error",
            title: "No hay conversación activa",
            message: "Selecciona primero una conversación."
        });
        return;
    }

    const { session } = await getCurrentSessionSafe();
    if (!session?.user?.id) return;

    const payload = {
        sender_id: session.user.id,
        receiver_id: activeConversation.partnerId,
        content
    };

    const { data, error } = await sendMessage(payload);

    if (error) {
        showToast({
            type: "error",
            title: "No fue posible enviar el mensaje",
            message: error.message || "Intenta nuevamente."
        });
        return;
    }

    input.value = "";

    updateState((state) => {
        state.messages.push(data);

        const targetConversation = state.conversations.find(
            (conversation) => conversation.id === activeConversation.id
        );

        if (targetConversation) {
            targetConversation.messages.push(data);
            targetConversation.last_message = data.content;
            targetConversation.last_message_at = data.created_at;
        }
    });

    renderConversationList();
    renderActiveConversation();
}

function bindMessageForm() {
    const form = document.getElementById("message-form");
    if (!form) return;

    form.addEventListener("submit", handleMessageSubmit);
}

document.addEventListener("DOMContentLoaded", () => {
    bindMessageForm();
    loadMessages();
});

document.addEventListener("nexo:route-changed", (event) => {
    if (event.detail.route === "messages") {
        renderConversationList();
        renderActiveConversation();
    }
});