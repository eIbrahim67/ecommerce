import axios from "axios";
import { getOrCreateGuestId } from "./guestId";

const API_BASE_URL = "/api/v1";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to inject the JWT token and guest ID header
api.interceptors.request.use((config) => {
    // Inject JWT token if authenticated
    const storedUser = localStorage.getItem("ecommerce_auth_user");
    if (storedUser) {
        try {
            const userObj = JSON.parse(storedUser);
            if (userObj.token) {
                config.headers.Authorization = `Bearer ${userObj.token}`;
            }
        } catch (e) {
            console.error("Failed to parse stored user for token", e);
        }
    }

    // For cart endpoints, also include the X-Guest-Id header
    // This supports both authenticated and anonymous cart operations
    if (config.url?.includes("/cart")) {
        const guestId = getOrCreateGuestId();
        config.headers["X-Guest-Id"] = guestId;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Global response interceptor to handle errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // You can handle global auth redirects here if needed
        if (error.response?.status === 401) {
            console.warn("Unauthorized access - possibly expired token.");
            // Optionally dispatch a logout event or clear localStorage
            // localStorage.removeItem("ecommerce_auth_user");
            // window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// Standard API response shape mapper to unwrap standard response envelope
// It can be helpful for queries to directly throw on success: false
export const unwrapResponse = (envelope: any) => {
    if (envelope && envelope.success === false) {
        const errors = envelope.errors ? envelope.errors.join(", ") : "";
        throw new Error(errors || envelope.message || "API Error");
    }
    return envelope;
};
