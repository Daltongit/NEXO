export const appState = {
    currentRoute: "dashboard",
    currentUser: null,
    profile: null,
    services: [],
    myServices: [],
    orders: [],
    messages: [],
    conversations: [],
    reviews: [],
    portfolio: [],
    selectedConversationId: null,
    ui: {
        serviceModalOpen: false,
        sidebarOpen: false,
        profileMenuOpen: false
    }
};

const listeners = new Set();

export function getState() {
    return appState;
}

export function setState(partialState = {}) {
    Object.assign(appState, partialState);
    emitChange();
}

export function updateState(updater) {
    if (typeof updater === "function") {
        updater(appState);
        emitChange();
    }
}

export function subscribe(listener) {
    if (typeof listener !== "function") return () => { };
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function emitChange() {
    listeners.forEach((listener) => {
        try {
            listener(appState);
        } catch (error) {
            console.error("Error en listener de estado:", error);
        }
    });
}

export function resetState() {
    appState.currentRoute = "dashboard";
    appState.currentUser = null;
    appState.profile = null;
    appState.services = [];
    appState.myServices = [];
    appState.orders = [];
    appState.messages = [];
    appState.conversations = [];
    appState.reviews = [];
    appState.portfolio = [];
    appState.selectedConversationId = null;
    appState.ui = {
        serviceModalOpen: false,
        sidebarOpen: false,
        profileMenuOpen: false
    };
    emitChange();
}