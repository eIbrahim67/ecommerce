import { Mail } from "lucide-react";
import newsletterBg from "@/assets/newsletter-bg.jpg";
import { useState } from "react";
import { api, unwrapResponse } from "@/lib/api";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";

const NewsletterBanner = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const res = await api.post("/newsletter/subscribe", { email });
      unwrapResponse(res.data);
      toast.success(t('home:newsletter.successMessage'));
      setEmail("");
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      toast.error(error.message || t('home:newsletter.errorMessage'));
    } finally {
      setTimeout(() => setIsSubmitting(false), 500);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl my-12 shadow-2xl" style={{ background: `linear-gradient(135deg, hsl(148 47% 48%) 0%, hsl(148 47% 38%) 100%)` }}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
      </div>
      <div className="container mx-auto flex items-center relative z-10">
        <div className="py-14 px-10 flex-1 max-w-2xl">
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-xs font-semibold mb-4">
            📧 {t('home:newsletter.badge')}
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-white leading-tight" style={{ fontFamily: "'Quicksand', sans-serif" }}>
            {t('home:newsletter.title')}
          </h2>
          <p className="text-white/90 mb-8 text-lg">{t('home:newsletter.subtitle')} <span className="text-yellow-300 font-bold">Nest Mart</span></p>
          <form onSubmit={handleSubmit} className="flex gap-3 flex-wrap">
            <div className="flex items-center bg-white rounded-xl px-5 py-4 flex-1 max-w-md border-2 border-white/30 shadow-xl">
              <Mail className="w-5 h-5 text-primary mr-3 shrink-0" />
              <input
                type="email"
                placeholder={t('home:newsletter.placeholder')}
                required
                className="outline-none text-sm flex-1 bg-transparent min-w-0 text-heading placeholder:text-text-body"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-sm hover:bg-yellow-300 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  {t('home:newsletter.subscribing')}
                </span>
              ) : (
                t('home:newsletter.subscribe')
              )}
            </button>
          </form>
        </div>
        <div className="hidden lg:block flex-1">
          <img src={newsletterBg} alt="Newsletter" className="w-full h-80 object-cover object-right opacity-90" />
        </div>
      </div>
    </section>
  );
};

export default NewsletterBanner;
