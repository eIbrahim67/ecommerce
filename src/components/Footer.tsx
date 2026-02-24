import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-surface-light border-t border-border">
      <div className="container mx-auto py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <span className="text-3xl">🛒</span>
            <div>
              <h3 className="text-xl font-bold leading-none">Nest</h3>
              <span className="text-xs text-text-body">MART & GROCERY</span>
            </div>
          </Link>
          <p className="text-sm text-text-body mb-4">Awesome grocery store website template</p>
          <div className="space-y-2 text-sm text-text-body">
            <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" /> 5171 W Campbell Ave, Kent, Utah 53127</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary shrink-0" /> (+91) - 540-025-124553</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary shrink-0" /> sale@Nest.com</div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary shrink-0" /> 10:00 - 18:00, Mon - Sat</div>
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
            <h4 className="font-bold text-base mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-text-body hover:text-primary transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container mx-auto py-4 flex flex-col md:flex-row items-center justify-between text-sm text-text-body">
          <p>© 2024, Nest - Grocery Store. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> <strong>1900 - 6666</strong></div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> <strong>1900 - 8888</strong></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
