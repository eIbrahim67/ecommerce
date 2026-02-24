import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterBanner from "@/components/NewsletterBanner";
import { MapPin, Phone, Mail } from "lucide-react";

const Contact = () => {
  const offices = [
    { title: "Office", address: "205 North Michigan Avenue, Suite 810", city: "Chicago, 60601, USA", phone: "(123) 456-7890", email: "contact@Evara.com" },
    { title: "Studio", address: "205 North Michigan Avenue, Suite 810", city: "Chicago, 60601, USA", phone: "(123) 456-7890", email: "contact@Evara.com" },
    { title: "Shop", address: "205 North Michigan Avenue, Suite 810", city: "Chicago, 60601, USA", phone: "(123) 456-7890", email: "contact@Evara.com" },
  ];

  const helpItems = [
    { num: "01", title: "Visit Feedback", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { num: "02", title: "Employer Services", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { num: "03", title: "Billing Inquiries", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { num: "04", title: "General Inquiries", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto py-4 text-sm text-text-body flex items-center gap-2">
        <span>🏠 Home</span> <span>/</span> <span>Pages</span> <span>/</span> <span className="text-primary">Contact</span>
      </div>

      {/* Help section */}
      <section className="container mx-auto my-8">
        <p className="text-primary font-semibold mb-2">How can help you ?</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>Let us know how we can help you</h1>
            <p className="text-text-body text-sm leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
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

      {/* Map placeholder */}
      <section className="container mx-auto my-8">
        <div className="bg-surface-light rounded-xl h-64 flex items-center justify-center border border-border">
          <span className="text-text-body text-sm">🗺️ Map Placeholder - Integrate your preferred map service</span>
        </div>
      </section>

      {/* Offices */}
      <section className="container mx-auto my-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {offices.map((office) => (
          <div key={office.title}>
            <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Quicksand', sans-serif" }}>{office.title}</h3>
            <p className="text-sm text-text-body mb-1">{office.address}</p>
            <p className="text-sm text-text-body mb-1">{office.city}</p>
            <p className="text-sm text-text-body mb-1">Phone: {office.phone}</p>
            <p className="text-sm text-text-body mb-3">Email: {office.email}</p>
            <button className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
              <MapPin className="w-4 h-4" /> View map
            </button>
          </div>
        ))}
      </section>

      {/* Contact form */}
      <section className="container mx-auto my-12">
        <p className="text-primary font-semibold mb-2">Contact form</p>
        <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Quicksand', sans-serif" }}>Drop Us a Line</h2>
        <div className="max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="First Name" className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
            <input type="email" placeholder="Your Email" className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
            <input type="tel" placeholder="Your Phone" className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
            <input type="text" placeholder="Subject" className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
          </div>
          <textarea placeholder="Your message..." rows={5} className="w-full border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors mb-4" />
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
            Send message
          </button>
        </div>
      </section>

      <div className="container mx-auto">
        <NewsletterBanner />
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
