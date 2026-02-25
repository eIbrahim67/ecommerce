import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const registerSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
    const { register: registerUser, isAuthenticated } = useAuth();
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    if (isAuthenticated) {
        return <Navigate to="/account" replace />;
    }

    const onSubmit = async (data: RegisterFormValues) => {
        await registerUser(data.firstName, data.lastName, data.email, data.password);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto py-16 flex items-center justify-center">
                <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-sm">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold font-heading mb-2">Create an Account</h1>
                        <p className="text-text-body text-sm">Join NestMart to start shopping</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">First Name</label>
                                <input
                                    type="text"
                                    {...register("firstName")}
                                    className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.firstName ? 'border-red-500' : 'border-border'}`}
                                    placeholder="John"
                                />
                                {errors.firstName && <p className="text-red-500 text-xs mt-1.5">{errors.firstName.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Last Name</label>
                                <input
                                    type="text"
                                    {...register("lastName")}
                                    className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.lastName ? 'border-red-500' : 'border-border'}`}
                                    placeholder="Doe"
                                />
                                {errors.lastName && <p className="text-red-500 text-xs mt-1.5">{errors.lastName.message}</p>}
                            </div>
                        </div>

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
                            <label className="block text-sm font-medium mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPw ? "text" : "password"}
                                    {...register("password")}
                                    className={`w-full border rounded-lg px-4 py-2.5 pr-11 outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.password ? 'border-red-500' : 'border-border'}`}
                                    placeholder="••••••••"
                                />
                                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-body hover:text-primary transition-colors">
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    {...register("confirmPassword")}
                                    className={`w-full border rounded-lg px-4 py-2.5 pr-11 outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-border'}`}
                                    placeholder="••••••••"
                                />
                                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-body hover:text-primary transition-colors">
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-6"
                        >
                            <UserPlus className="w-4 h-4" /> Sign Up
                        </button>
                    </form>

                    <p className="text-center text-sm text-text-body mt-6">
                        Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Register;
