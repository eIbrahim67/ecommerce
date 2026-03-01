import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const Footer = () => {
  const { t } = useLanguage();
  
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
          <p className="text-sm text-text-body mb-6 leading-relaxed">{t('navigation:footer.tagline')}</p>
          <div className="space-y-3 text-sm text-text-body">
            <a 
              href="https://maps.app.goo.gl/59LfdwQNFngE7GJt7"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 hover:text-primary transition-colors"
            >
              <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" /> 
              <span>A Market (El Ordonia Branch), 10th of Ramadan City 1, Al-Sharqia Governorate 7063112, Egypt</span>
            </a>
            <a 
              href="tel:+201550162282"
              className="flex items-center gap-3 hover:text-primary transition-colors"
            >
              <Phone className="w-5 h-5 text-primary shrink-0" /> 
              <span>+201550162282</span>
            </a>
            <a 
              href="mailto:contact@nestmart.com"
              className="flex items-center gap-3 hover:text-primary transition-colors"
            >
              <Mail className="w-5 h-5 text-primary shrink-0" /> 
              <span>contact@nestmart.com</span>
            </a>
            <div className="flex items-center gap-3 hover:text-primary transition-colors">
              <Clock className="w-5 h-5 text-primary shrink-0" /> 
              <span>{t('navigation:footer.hours')}</span>
            </div>
          </div>
        </div>

        {/* Links */}
        {[
          { 
            title: t('navigation:footer.company'), 
            links: [
              { key: 'aboutUs', label: t('navigation:footer.links.aboutUs') },
              { key: 'deliveryInfo', label: t('navigation:footer.links.deliveryInfo') },
              { key: 'privacyPolicy', label: t('navigation:footer.links.privacyPolicy') },
              { key: 'termsConditions', label: t('navigation:footer.links.termsConditions') },
              { key: 'contactUs', label: t('navigation:footer.links.contactUs') }
            ]
          },
          { 
            title: t('navigation:footer.account'), 
            links: [
              { key: 'signIn', label: t('navigation:footer.links.signIn') },
              { key: 'viewCart', label: t('navigation:footer.links.viewCart') },
              { key: 'myWishlist', label: t('navigation:footer.links.myWishlist') },
              { key: 'trackOrder', label: t('navigation:footer.links.trackOrder') },
              { key: 'helpTicket', label: t('navigation:footer.links.helpTicket') }
            ]
          },
          { 
            title: t('navigation:footer.corporate'), 
            links: [
              { key: 'becomeVendor', label: t('navigation:footer.links.becomeVendor') },
              { key: 'affiliateProgram', label: t('navigation:footer.links.affiliateProgram') },
              { key: 'farmBusiness', label: t('navigation:footer.links.farmBusiness') },
              { key: 'farmCareers', label: t('navigation:footer.links.farmCareers') },
              { key: 'ourSuppliers', label: t('navigation:footer.links.ourSuppliers') }
            ]
          },
          { 
            title: t('navigation:footer.popular'), 
            links: [
              { key: 'milk', label: t('navigation:footer.links.milk') },
              { key: 'butter', label: t('navigation:footer.links.butter') },
              { key: 'eggs', label: t('navigation:footer.links.eggs') },
              { key: 'marmalades', label: t('navigation:footer.links.marmalades') },
              { key: 'sourCream', label: t('navigation:footer.links.sourCream') }
            ]
          }
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-bold text-base mb-5 text-heading" style={{ fontFamily: "'Quicksand', sans-serif" }}>{col.title}</h4>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.key}>
                  <a href="#" className="text-sm text-text-body hover:text-primary hover:translate-x-1 inline-block transition-all">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border bg-white/50">
        <div className="container mx-auto py-6 flex flex-col md:flex-row items-center justify-between text-sm text-text-body gap-4">
          <p>{t('navigation:footer.copyright')}</p>
          <div className="flex items-center gap-6">
            <a 
              href="tel:+201550162282"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4 text-primary" /> 
              <strong>+201550162282</strong>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
