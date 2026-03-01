/**
 * Guest ID utility for anonymous cart operations.
 * Generates and manages UUID v4 for guest users.
 */

const GUEST_ID_STORAGE_KEY = "ecommerce_guest_id";

/**
 * Generates a UUID v4 string
 */
function generateUUIDv4(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Gets or creates a guest ID. Returns the existing guest ID if one is stored,
 * otherwise generates a new one and persists it.
 */
export function getOrCreateGuestId(): string {
    let guestId = localStorage.getItem(GUEST_ID_STORAGE_KEY);

    if (!guestId) {
        guestId = generateUUIDv4();
        localStorage.setItem(GUEST_ID_STORAGE_KEY, guestId);
    }

    return guestId;
}

/**
 * Clears the stored guest ID (useful for testing or when switching environments)
 */
export function clearGuestId(): void {
    localStorage.removeItem(GUEST_ID_STORAGE_KEY);
}

/**
 * Returns the current guest ID without creating one if it doesn't exist.
 */
export function getGuestId(): string | null {
    return localStorage.getItem(GUEST_ID_STORAGE_KEY);
}
