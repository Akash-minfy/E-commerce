import { create } from 'zustand';

// Helper: generate a user-specific localStorage key
const cartKey = (userInfo) => userInfo ? `cartItems_${userInfo._id}` : null;

const useStore = create((set, get) => ({
    // ─── User State ────────────────────────────────────────────────────────────
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,

    login: (userData) => {
        // On login, load this user's saved cart from localStorage (if any)
        const savedCart = localStorage.getItem(`cartItems_${userData._id}`);
        set({
            userInfo: userData,
            cartItems: savedCart ? JSON.parse(savedCart) : [],
        });
        localStorage.setItem('userInfo', JSON.stringify(userData));
    },

    logout: () => {
        // Clear the in-memory cart on logout so next user starts fresh
        set({ userInfo: null, cartItems: [] });
        localStorage.removeItem('userInfo');
        // Note: we deliberately keep the user-specific cart in localStorage
        // so their cart is restored on their next login.
    },

    // ─── Cart State ────────────────────────────────────────────────────────────
    // On initial app load, try to load the cart for whoever is already logged in
    cartItems: (() => {
        const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
        const key = cartKey(userInfo);
        return key && localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
    })(),

    addToCart: (item) => set((state) => {
        if (!state.userInfo) return state; // Guard: do nothing if not logged in
        const existItem = state.cartItems.find(x => x.product === item.product);
        let newItems;
        if (existItem) {
            newItems = state.cartItems.map(x => x.product === existItem.product ? item : x);
        } else {
            newItems = [...state.cartItems, item];
        }
        localStorage.setItem(cartKey(state.userInfo), JSON.stringify(newItems));
        return { cartItems: newItems };
    }),

    removeFromCart: (id) => set((state) => {
        const newItems = state.cartItems.filter(x => x.product !== id);
        if (state.userInfo) {
            localStorage.setItem(cartKey(state.userInfo), JSON.stringify(newItems));
        }
        return { cartItems: newItems };
    }),

    clearCart: () => set((state) => {
        if (state.userInfo) {
            localStorage.removeItem(cartKey(state.userInfo));
        }
        return { cartItems: [] };
    }),
}));

export default useStore;
