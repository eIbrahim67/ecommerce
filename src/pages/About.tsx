import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterBanner from "@/components/NewsletterBanner";
import { CheckCircle } from "lucide-react";

const About = () => {
  const features = [
    { icon: "💰", title: "Best Prices & Offers" },
    { icon: "🧺", title: "Wide Assortment" },
    { icon: "🚚", title: "Free Delivery" },
    { icon: "↩️", title: "Easy Returns" },
    { icon: "✅", title: "100% Satisfaction" },
    { icon: "🏷️", title: "Great Daily Deal" },
  ];

  const stats = [
    { value: "10+", label: "Glorious years" },
    { value: "500+", label: "Happy clients" },
    { value: "100+", label: "Projects complete" },
    { value: "25+", label: "Team advisor" },
    { value: "1M+", label: "Products Sale" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto py-4 text-sm text-text-body flex items-center gap-2">
        <span>🏠 Home</span> <span>/</span> <span>Pages</span> <span>/</span> <span className="text-primary">About Us</span>
      </div>

      {/* Welcome section */}
      <section className="container mx-auto my-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <div className="bg-surface-light rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=450&fit=crop" alt="Welcome" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>Welcome to Nest</h2>
            <p className="text-text-body text-sm leading-relaxed mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="text-text-body text-sm leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
            </p>
          </div>
        </div>
      </section>

      {/* What we provide */}
      <section className="container mx-auto my-12 text-center">
        <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Quicksand', sans-serif" }}>What We Provide?</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all">
              <span className="text-4xl mb-4 block">{f.icon}</span>
              <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>{f.title}</h3>
              <p className="text-sm text-text-body">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.</p>
              <a href="#" className="text-primary text-sm font-medium mt-3 inline-block hover:underline">Read more →</a>
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
            <p className="text-primary text-sm font-semibold mb-2">Our performance</p>
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>Your Partner for e-commerce grocery solution</h2>
            <p className="text-text-body text-sm leading-relaxed mb-6">
              Ed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {["Who we are", "Our history", "Our mission"].map((title) => (
                <div key={title}>
                  <h4 className="font-bold text-sm mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>{title}</h4>
                  <p className="text-xs text-text-body">With big discounts of segments of Lorem ipsum available with many variations.</p>
                </div>
              ))}
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
