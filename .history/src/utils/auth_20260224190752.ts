// Abstract definition for our user object. 
// This keeps our frontend perfectly scalable when a real database/API provides real values.
export type UserRole = 'customer' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    joinedAt: string;
}

const AUTH_KEY = 'ecommerce_auth_session';

/**
 * Abstraction layer to mock backend authentication tokens/sessions
 * Currently using localStorage, but easily swappable for cookies or secure HTTP-only tokens.
 */
export const AuthStorage = {
    // Get current active user session
    getUser: (): User | null => {
        try {
            const data = localStorage.getItem(AUTH_KEY);
            if (!data) return null;
            return JSON.parse(data) as User;
        } catch {
            return null;
        }
    },

    // Save successful auth session
    setUser: (user: User): void => {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    },

    // Clear session on logout
    clearUser: (): void => {
        localStorage.removeItem(AUTH_KEY);
    }
};
