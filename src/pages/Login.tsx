import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Link, Navigate, useLocation } from "react-router-dom";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

const Login = () => {
    const { login, isAuthenticated } = useAuth();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/account";
    const [showPw, setShowPw] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t, isRTL } = useLanguage();

    const loginSchema = z.object({
        email: z.string().email(t('auth:validation.emailInvalid')),
        password: z.string().min(6, t('auth:validation.passwordMinLength')),
    });

    type LoginFormValues = z.infer<typeof loginSchema>;

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
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await login(data.email, data.password);
        } finally {
            setTimeout(() => setIsSubmitting(false), 500);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto py-16 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-sm">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold font-heading mb-2">{t('auth:login.title')}</h1>
                        <p className="text-text-body text-sm">{t('auth:login.subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">{t('auth:login.emailLabel')}</label>
                            <input
                                type="email"
                                {...register("email")}
                                className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.email ? 'border-red-500' : 'border-border'}`}
                                placeholder={t('auth:login.emailPlaceholder')}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-medium">{t('auth:login.passwordLabel')}</label>
                                <Link to="/forgot-password" className="text-xs text-primary hover:underline">{t('auth:login.forgotPasswordLink')}</Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPw ? "text" : "password"}
                                    {...register("password")}
                                    className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.password ? 'border-red-500' : 'border-border'} ${isRTL ? 'pl-11 pr-4' : 'pr-11 pl-4'}`}
                                    placeholder={t('auth:login.passwordPlaceholder')}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPw(v => !v)} 
                                    className={`absolute top-1/2 -translate-y-1/2 text-text-body hover:text-primary transition-colors ${isRTL ? 'left-3' : 'right-3'}`}
                                >
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    {t('auth:login.submittingButton')}
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-4 h-4" /> {t('auth:login.submitButton')}
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-text-body mt-6">
                        {t('auth:login.noAccount')} <Link to="/register" className="text-primary font-semibold hover:underline">{t('auth:login.signUpLink')}</Link>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;
