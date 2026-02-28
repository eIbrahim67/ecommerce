import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-surface-light to-white border-t border-border mt-16">
      <div className="container mx-auto py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-3 mb-6 group">
            <span className="text-4xl group-hover:scale-110 transition-transform">🛒</span>
            <div>
              <h3 className="text-2xl font-bold leading-none text-heading">Nest-Mart</h3>
              <span className="text-xs text-text-body tracking-widest font-semibold uppercase">Grocery</span>
            </div>
          </Link>
          <p className="text-sm text-text-body mb-6 leading-relaxed">Your trusted partner for fresh, organic groceries delivered right to your doorstep.</p>
          <div className="space-y-3 text-sm text-text-body">
            <div className="flex items-start gap-3 hover:text-primary transition-colors cursor-pointer">
              <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" /> 
              <span>5171 W Campbell Ave, Kent, Utah 53127</span>
            </div>
            <div className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer">
              <Phone className="w-5 h-5 text-primary shrink-0" /> 
              <span>(+91) - 540-025-124553</span>
            </div>
            <div className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer">
              <Mail className="w-5 h-5 text-primary shrink-0" /> 
              <span>sale@Nest.com</span>
            </div>
            <div className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer">
              <Clock className="w-5 h-5 text-primary shrink-0" /> 
              <span>10:00 - 18:00, Mon - Sat</span>
            </div>
          </div>
        </div>

        {/* Links */}
        {[
          { title: "Company", links: ["About Us", "Delivery Information", "Privacy Policy", "Terms & Conditions", "Contact Us"] },
          { title: "Account", links: ["Sign In", "View Cart", "My Wishlist", "Track My Order", "Help Ticket"] },
          { title: "Corporate", links: ["Become a Vendor", "Affiliate Program", "Farm Business", "Farm Careers", "Our Suppliers"] },
          { title: "Popular", links: ["Milk & Flavoured Milk", "Butter and Margarine", "Eggs Substitutes", "Marmalades", "Sour Cream and Dips"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-bold text-base mb-5 text-heading" style={{ fontFamily: "'Quicksand', sans-serif" }}>{col.title}</h4>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-text-body hover:text-primary hover:translate-x-1 inline-block transition-all">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border bg-white/50">
        <div className="container mx-auto py-6 flex flex-col md:flex-row items-center justify-between text-sm text-text-body gap-4">
          <p>© 2024, <span className="font-semibold text-primary">Nest-Mart</span> - Grocery Store. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
              <Phone className="w-4 h-4 text-primary" /> 
              <strong>1900 - 6666</strong>
            </div>
            <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
              <Phone className="w-4 h-4 text-primary" /> 
              <strong>1900 - 8888</strong>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
