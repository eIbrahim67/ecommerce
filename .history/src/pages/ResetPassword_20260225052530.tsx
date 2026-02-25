import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { api, unwrapResponse } from "@/lib/api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";

    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password || password.length < 8) { setError("Password must be at least 8 characters."); return; }
        if (password !== confirmPassword) { setError("Passwords do not match."); return; }
        setError("");
        setIsLoading(true);
        try {
            const res = await api.post("/auth/reset-password", { email, token, newPassword: password });
            unwrapResponse(res.data);
            toast.success("Password reset successfully! You can now log in.");
            navigate("/login");
        } catch (err: any) {
            toast.error(err.message || "Failed to reset password. The link may have expired.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 container mx-auto py-16 flex items-center justify-center">
                    <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-sm text-center">
                        <h1 className="text-xl font-bold mb-4">Invalid Reset Link</h1>
                        <p className="text-text-body text-sm mb-6">This password reset link is invalid or has expired.</p>
                        <Link to="/forgot-password" className="text-primary font-semibold hover:underline">Request a new link</Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto py-16 flex items-center justify-center">
                <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-sm">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <KeyRound className="w-7 h-7 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold font-heading mb-2">Reset Password</h1>
                        <p className="text-text-body text-sm">Enter a new password for <strong>{email}</strong></p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPw ? "text" : "password"}
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError(""); }}
                                    placeholder="Min. 8 characters"
                                    className={`w-full border rounded-lg px-4 py-2.5 pr-11 outline-none focus:ring-2 focus:ring-primary/20 transition-all ${error ? "border-red-500" : "border-border"}`}
                                />
                                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-body hover:text-primary transition-colors">
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={e => { setConfirmPassword(e.target.value); setError(""); }}
                                    placeholder="Re-enter new password"
                                    className={`w-full border rounded-lg px-4 py-2.5 pr-11 outline-none focus:ring-2 focus:ring-primary/20 transition-all ${error ? "border-red-500" : "border-border"}`}
                                />
                                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-body hover:text-primary transition-colors">
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ResetPassword;
