import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

const Register = () => {
    const { register: registerUser, isAuthenticated } = useAuth();
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t, isRTL } = useLanguage();

    const registerSchema = z.object({
        firstName: z.string().min(2, t('auth:validation.firstNameRequired')),
        lastName: z.string().min(2, t('auth:validation.lastNameRequired')),
        email: z.string().email(t('auth:validation.emailInvalid')),
        password: z.string().min(6, t('auth:validation.passwordMinLength')),
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: t('auth:validation.passwordsNoMatch'),
        path: ["confirmPassword"]
    });

    type RegisterFormValues = z.infer<typeof registerSchema>;

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
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await registerUser(data.firstName, data.lastName, data.email, data.password);
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
                        <h1 className="text-3xl font-bold font-heading mb-2">{t('auth:register.title')}</h1>
                        <p className="text-text-body text-sm">{t('auth:register.subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">{t('auth:register.firstNameLabel')}</label>
                                <input
                                    type="text"
                                    {...register("firstName")}
                                    className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.firstName ? 'border-red-500' : 'border-border'}`}
                                    placeholder={t('auth:register.firstNamePlaceholder')}
                                />
                                {errors.firstName && <p className="text-red-500 text-xs mt-1.5">{errors.firstName.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">{t('auth:register.lastNameLabel')}</label>
                                <input
                                    type="text"
                                    {...register("lastName")}
                                    className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.lastName ? 'border-red-500' : 'border-border'}`}
                                    placeholder={t('auth:register.lastNamePlaceholder')}
                                />
                                {errors.lastName && <p className="text-red-500 text-xs mt-1.5">{errors.lastName.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">{t('auth:register.emailLabel')}</label>
                            <input
                                type="email"
                                {...register("email")}
                                className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.email ? 'border-red-500' : 'border-border'}`}
                                placeholder={t('auth:register.emailPlaceholder')}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">{t('auth:register.passwordLabel')}</label>
                            <div className="relative">
                                <input
                                    type={showPw ? "text" : "password"}
                                    {...register("password")}
                                    className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.password ? 'border-red-500' : 'border-border'} ${isRTL ? 'pl-11 pr-4' : 'pr-11 pl-4'}`}
                                    placeholder={t('auth:register.passwordPlaceholder')}
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

                        <div>
                            <label className="block text-sm font-medium mb-1.5">{t('auth:register.confirmPasswordLabel')}</label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    {...register("confirmPassword")}
                                    className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-border'} ${isRTL ? 'pl-11 pr-4' : 'pr-11 pl-4'}`}
                                    placeholder={t('auth:register.confirmPasswordPlaceholder')}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowConfirm(v => !v)} 
                                    className={`absolute top-1/2 -translate-y-1/2 text-text-body hover:text-primary transition-colors ${isRTL ? 'left-3' : 'right-3'}`}
                                >
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    {t('auth:register.submittingButton')}
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" /> {t('auth:register.submitButton')}
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-text-body mt-6">
                        {t('auth:register.haveAccount')} <Link to="/login" className="text-primary font-semibold hover:underline">{t('auth:register.signInLink')}</Link>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Register;
