import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { api, unwrapResponse } from "@/lib/api";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const { t } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) { 
            setError(t('auth:validation.emailFieldRequired')); 
            return; 
        }
        setError("");
        setIsLoading(true);
        try {
            const res = await api.post("/auth/forgot-password", { email });
            unwrapResponse(res.data);
            setSent(true);
            toast.success(t('auth:messages.resetLinkSent'));
        } catch (err: any) {
            toast.error(err.message || t('auth:messages.resetLinkError'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto py-16 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-sm">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-7 h-7 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold font-heading mb-2">{t('auth:forgotPassword.title')}</h1>
                        <p className="text-text-body text-sm">
                            {t('auth:forgotPassword.subtitle')}
                        </p>
                    </div>

                    {sent ? (
                        <div className="text-center space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm">
                                ✓ {t('auth:forgotPassword.successMessage')} <strong>{email}</strong>. {t('auth:forgotPassword.successInstruction')}
                            </div>
                            <Link to="/login" className="flex items-center justify-center gap-2 text-primary hover:underline text-sm font-medium">
                                <ArrowLeft className="w-4 h-4" /> {t('auth:forgotPassword.backToLogin')}
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">{t('auth:forgotPassword.emailLabel')}</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setError(""); }}
                                    placeholder={t('auth:forgotPassword.emailPlaceholder')}
                                    className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all ${error ? "border-red-500" : "border-border"}`}
                                />
                                {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {isLoading ? t('auth:forgotPassword.submittingButton') : t('auth:forgotPassword.submitButton')}
                            </button>

                            <div className="text-center">
                                <Link to="/login" className="flex items-center justify-center gap-2 text-text-body hover:text-primary text-sm transition-colors">
                                    <ArrowLeft className="w-4 h-4" /> {t('auth:forgotPassword.backToLogin')}
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ForgotPassword;
