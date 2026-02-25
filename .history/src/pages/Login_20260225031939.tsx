import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Link, Navigate, useLocation } from "react-router-dom";
import { LogIn } from "lucide-react";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
    const { login, isAuthenticated } = useAuth();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/account";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    if (isAuthenticated) {
        return <Navigate to={from} replace />;
    }

    const onSubmit = async (data: LoginFormValues) => {
        await login(data.email, data.password);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto py-16 flex items-center justify-center">
                <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-sm">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold font-heading mb-2">Welcome Back</h1>
                        <p className="text-text-body text-sm">Please sign in to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Email Address</label>
                            <input
                                type="email"
                                {...register("email")}
                                className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.email ? 'border-red-500' : 'border-border'}`}
                                placeholder="you@example.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-medium">Password</label>
                                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                {...register("password")}
                                className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.password ? 'border-red-500' : 'border-border'}`}
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-6"
                        >
                            <LogIn className="w-4 h-4" /> Sign In
                        </button>
                    </form>

                    <p className="text-center text-sm text-text-body mt-6">
                        Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Sign up</Link>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;
