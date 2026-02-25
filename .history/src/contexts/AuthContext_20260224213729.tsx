import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export type Role = "customer" | "admin";

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (email: string, role?: Role) => void;
    register: (name: string, email: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // Load session from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("ecommerce_auth_user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
                localStorage.removeItem("ecommerce_auth_user");
            }
        }
    }, []);

    const login = (email: string, role: Role = "customer") => {
        // In a real app, we would validate credentials against a backend
        // Since this is frontend only architecture, we simulate login by fetching from our mock DB or creating a dummy
        let mockUser: User = {
            id: Math.random().toString(36).substring(2, 9),
            name: email.split("@")[0], // Mock name from email
            email: email,
            role: role,
        };

        // Check if user exists in our local simulated DB
        const usersDb = JSON.parse(localStorage.getItem("ecommerce_users_db") || "[]");
        const existingUser = usersDb.find((u: User) => u.email === email);

        if (existingUser) {
            mockUser = existingUser;
        }

        setUser(mockUser);
        localStorage.setItem("ecommerce_auth_user", JSON.stringify(mockUser));
        toast.success("Successfully logged in.");
    };

    const register = (name: string, email: string) => {
        const usersDb = JSON.parse(localStorage.getItem("ecommerce_users_db") || "[]");

        if (usersDb.some((u: User) => u.email === email)) {
            toast.error("Email already in use.");
            return;
        }

        // Since this is frontend only, we auto-assign first user as admin for testing purposes
        const isFirstUser = usersDb.length === 0;
        const role: Role = isFirstUser ? "admin" : "customer";

        const newUser: User = {
            id: Math.random().toString(36).substring(2, 9),
            name,
            email,
            role
        };

        usersDb.push(newUser);
        localStorage.setItem("ecommerce_users_db", JSON.stringify(usersDb));

        // Auto login
        setUser(newUser);
        localStorage.setItem("ecommerce_auth_user", JSON.stringify(newUser));
        toast.success(`Account created successfully! ${isFirstUser ? 'You are an admin.' : ''}`);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("ecommerce_auth_user");
        toast.info("You have been logged out.");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isAdmin: user?.role === "admin",
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
