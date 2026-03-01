import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterBanner from "@/components/NewsletterBanner";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import SEO from "@/components/SEO";

const About = () => {
  const { t } = useLanguage();

  const features = [
    { icon: "💰", title: t('about:whatWeProvide.features.bestPrices') },
    { icon: "🧺", title: t('about:whatWeProvide.features.wideAssortment') },
    { icon: "🚚", title: t('about:whatWeProvide.features.freeDelivery') },
    { icon: "↩️", title: t('about:whatWeProvide.features.easyReturns') },
    { icon: "✅", title: t('about:whatWeProvide.features.satisfaction') },
    { icon: "🏷️", title: t('about:whatWeProvide.features.dailyDeal') },
  ];

  const stats = [
    { value: "10+", label: t('about:stats.gloriousYears') },
    { value: "500+", label: t('about:stats.happyClients') },
    { value: "100+", label: t('about:stats.projectsComplete') },
    { value: "25+", label: t('about:stats.teamAdvisor') },
    { value: "1M+", label: t('about:stats.productsSale') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t('about:pageTitle')}
        description={t('about:pageDescription')}
      />
      <Header />

      {/* Welcome section */}
      <section className="container mx-auto my-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <div className="bg-surface-light rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=450&fit=crop" alt="Welcome" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>
              {t('about:welcome.title')}
            </h2>
            <p className="text-text-body text-sm leading-relaxed mb-4">
              {t('about:welcome.paragraph1')}
            </p>
            <p className="text-text-body text-sm leading-relaxed">
              {t('about:welcome.paragraph2')}
            </p>
          </div>
        </div>
      </section>

      {/* What we provide */}
      <section className="container mx-auto my-12 text-center">
        <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Quicksand', sans-serif" }}>
          {t('about:whatWeProvide.title')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all">
              <span className="text-4xl mb-4 block">{f.icon}</span>
              <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>{f.title}</h3>
              <p className="text-sm text-text-body">{t('about:whatWeProvide.featureDescription')}</p>
              <a href="#" className="text-primary text-sm font-medium mt-3 inline-block hover:underline">
                {t('about:whatWeProvide.readMore')} →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Performance */}
      <section className="container mx-auto my-12">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop" alt="Performance" className="rounded-2xl w-full h-80 object-cover" />
          </div>
          <div className="md:w-1/2">
            <p className="text-primary text-sm font-semibold mb-2">{t('about:performance.subtitle')}</p>
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>
              {t('about:performance.title')}
            </h2>
            <p className="text-text-body text-sm leading-relaxed mb-6">
              {t('about:performance.description')}
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h4 className="font-bold text-sm mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                  {t('about:performance.whoWeAre.title')}
                </h4>
                <p className="text-xs text-text-body">{t('about:performance.whoWeAre.description')}</p>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                  {t('about:performance.ourHistory.title')}
                </h4>
                <p className="text-xs text-text-body">{t('about:performance.ourHistory.description')}</p>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                  {t('about:performance.ourMission.title')}
                </h4>
                <p className="text-xs text-text-body">{t('about:performance.ourMission.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary my-12">
        <div className="container mx-auto py-10 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold" style={{ fontFamily: "'Quicksand', sans-serif", color: 'hsl(0 0% 100%)' }}>{s.value}</p>
              <p className="text-sm mt-1" style={{ color: 'hsla(0, 0%, 100%, 0.8)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="container mx-auto">
        <NewsletterBanner />
      </div>
      <Footer />
    </div>
  );
};

export default About;
