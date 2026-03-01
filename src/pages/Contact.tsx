import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterBanner from "@/components/NewsletterBanner";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { api, unwrapResponse } from "@/lib/api";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";
import SEO from "@/components/SEO";

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const offices = [
    { 
      title: t('contact:offices.office'), 
      address: "Nest-Mart", 
      city: "10th of Ramadan City 1, Al-Sharqia Governorate 7063112, Egypt", 
      phone: "+201550162282", 
      email: "contact@nestmart.com",
      hours: t('contact:offices.hours24')
    },
  ];

  const helpItems = [
    { num: "01", title: t('contact:helpItems.visitFeedback.title'), desc: t('contact:helpItems.visitFeedback.description') },
    { num: "02", title: t('contact:helpItems.employerServices.title'), desc: t('contact:helpItems.employerServices.description') },
    { num: "03", title: t('contact:helpItems.billingInquiries.title'), desc: t('contact:helpItems.billingInquiries.description') },
    { num: "04", title: t('contact:helpItems.generalInquiries.title'), desc: t('contact:helpItems.generalInquiries.description') },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return toast.error(t('contact:form.requiredFields'));
    }

    try {
      setIsSubmitting(true);
      const res = await api.post("/contact/submit", formData);
      unwrapResponse(res.data);
      toast.success(t('contact:form.successMessage'));
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error: any) {
      console.error("Failed to submit contact form:", error);
      toast.error(error.message || t('contact:form.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t('contact:pageTitle')}
        description={t('contact:pageDescription')}
      />
      <Header />
      {/* Help section */}
      <section className="container mx-auto px-4 xl:px-0 my-8">
        <p className="text-primary font-semibold mb-2">{t('contact:helpSection.subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>
              {t('contact:helpSection.title')}
            </h1>
            <p className="text-text-body text-sm leading-relaxed">{t('contact:helpSection.description')}</p>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {helpItems.map((item) => (
              <div key={item.num}>
                <h3 className="font-bold mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                  <span className="text-primary">{item.num}.</span> {item.title}
                </h3>
                <p className="text-sm text-text-body">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="container mx-auto px-4 xl:px-0 my-8">
        <div className="bg-surface-light rounded-xl overflow-hidden border border-border">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23958.774927364866!2d31.704639893291247!3d30.306918896593555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1457fd94fbbb570d%3A0xe7b29f602b466370!2sA%20Market%20(%20El%20Ordonia%20Branch%20)!5e0!3m2!1sen!2seg!4v1772370139405!5m2!1sen!2seg" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Nest-Mart Location"
          />
        </div>
      </section>

      {/* Office */}
      <section className="container mx-auto px-4 xl:px-0 my-8">
        <div className="max-w-md">
          <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Quicksand', sans-serif" }}>{offices[0].title}</h3>
          <p className="text-sm text-text-body mb-1">{offices[0].address}</p>
          <p className="text-sm text-text-body mb-1">{offices[0].city}</p>
          <p className="text-sm text-text-body mb-1">{t('contact:offices.phone')}: {offices[0].phone}</p>
          <p className="text-sm text-text-body mb-1">{t('contact:offices.email')}: {offices[0].email}</p>
          <p className="text-sm text-text-body mb-3">{t('contact:offices.workingHours')}: {offices[0].hours}</p>
          <a 
            href="https://maps.app.goo.gl/59LfdwQNFngE7GJt7"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded-lg font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <MapPin className="w-4 h-4" /> {t('contact:offices.viewMap')}
          </a>
        </div>
      </section>

      {/* Contact form */}
      <section className="container mx-auto px-4 xl:px-0 my-12">
        <p className="text-primary font-semibold mb-2">{t('contact:form.subtitle')}</p>
        <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Quicksand', sans-serif" }}>
          {t('contact:form.title')}
        </h2>
        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder={t('contact:form.namePlaceholder')}
              required
              className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-card"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="email"
              placeholder={t('contact:form.emailPlaceholder')}
              required
              className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-card"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="tel"
              placeholder={t('contact:form.phonePlaceholder')}
              className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-card"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <input
              type="text"
              placeholder={t('contact:form.subjectPlaceholder')}
              className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-card"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>
          <textarea
            placeholder={t('contact:form.messagePlaceholder')}
            required
            rows={5}
            className="w-full border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors mb-4 bg-card"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-brand-green text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? t('contact:form.sending') : t('contact:form.sendButton')}
          </button>
        </form>
      </section>

      <div className="container mx-auto px-4 xl:px-0 mt-8 mb-8">
        <NewsletterBanner />
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
