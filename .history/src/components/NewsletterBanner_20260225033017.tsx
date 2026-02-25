import { Mail } from "lucide-react";
import newsletterBg from "@/assets/newsletter-bg.jpg";
import { useState } from "react";
import { api, unwrapResponse } from "@/lib/api";
import { toast } from "sonner";

const NewsletterBanner = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsSubmitting(true);
      const res = await api.post("/newsletter/subscribe", { email });
      unwrapResponse(res.data);
      toast.success("Successfully subscribed to the newsletter!");
      setEmail("");
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      toast.error(error.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl my-12" style={{ background: `linear-gradient(135deg, hsl(148 40% 94%) 0%, hsl(148 35% 90%) 100%)` }}>
      <div className="container mx-auto flex items-center">
        <div className="py-12 px-8 flex-1 max-w-lg">
          <h2 className="text-3xl lg:text-4xl font-bold mb-3" style={{ fontFamily: "'Quicksand', sans-serif" }}>
            Stay home & get your daily needs from our shop
          </h2>
          <p className="text-text-body mb-6">Start Your Daily Shopping with <span className="text-primary font-semibold">Nest Mart</span></p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex items-center bg-background rounded-lg px-4 py-2 flex-1 max-w-xs border border-border">
              <Mail className="w-4 h-4 text-text-body mr-2 shrink-0" />
              <input
                type="email"
                placeholder="Your email address"
                required
                className="outline-none text-sm flex-1 bg-transparent min-w-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? "Wait..." : "Subscribe"}
            </button>
          </form>
        </div>
        <div className="hidden lg:block flex-1">
          <img src={newsletterBg} alt="Newsletter" className="w-full h-64 object-cover object-right" />
        </div>
      </div>
    </section>
  );
};

export default NewsletterBanner;
