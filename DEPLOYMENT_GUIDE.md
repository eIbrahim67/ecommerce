# Nest-Mart Deployment Guide

## Quick Start

### 1. Pre-Deployment Checklist

#### Required Image Assets
Create these images before deploying:

```
public/
├── og-image.jpg          # 1200x630px - Open Graph image
├── favicon.svg           # SVG format - Browser favicon
├── apple-touch-icon.png  # 180x180px - iOS home screen
├── icon-192.png          # 192x192px - PWA icon
├── icon-512.png          # 512x512px - PWA icon
└── screenshot-1.png      # 1280x720px - PWA screenshot
```

#### Environment Variables
Create `.env.production`:
```env
VITE_API_URL=https://nestmart.runasp.net
```

### 2. Build for Production

```bash
# Install dependencies
npm install

# Run type check
npm run type-check

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### 3. Deploy to Hosting

#### Option A: Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod --dir=dist
```

3. Configure:
- Build command: `npm run build`
- Publish directory: `dist`
- Add environment variables in Netlify dashboard

#### Option B: Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Configure:
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

#### Option C: Traditional Hosting (cPanel, etc.)

1. Build locally:
```bash
npm run build
```

2. Upload `dist/` folder contents to your hosting

3. Configure `.htaccess` for SPA routing:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 4. Post-Deployment Tasks

#### A. Verify Deployment
- [ ] Visit your domain
- [ ] Test all pages load correctly
- [ ] Test language switcher (English/Arabic)
- [ ] Test mobile responsiveness
- [ ] Verify images load
- [ ] Test contact form
- [ ] Test shopping cart
- [ ] Test checkout process

#### B. SEO Setup

1. **Google Search Console**
   - Add property: https://ecommerce-nest-mart.vercel.app
   - Verify ownership
   - Submit sitemap: https://ecommerce-nest-mart.vercel.app/sitemap.xml
   - Request indexing for main pages

2. **Bing Webmaster Tools**
   - Add site
   - Submit sitemap
   - Verify ownership

3. **Google My Business**
   - Create/claim business listing
   - Add location: 10th of Ramadan City
   - Add phone: +201550162282
   - Add hours: 24/7
   - Add photos

#### C. Analytics Setup

1. **Google Analytics 4**
```html
<!-- Add to index.html before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

2. **Facebook Pixel** (Optional)
3. **Microsoft Clarity** (Optional)

#### D. Social Media

1. **Facebook**
   - Test Open Graph tags: https://developers.facebook.com/tools/debug/
   - Share your site and verify preview

2. **Twitter/X**
   - Test Twitter Cards: https://cards-dev.twitter.com/validator
   - Verify card preview

3. **WhatsApp Business**
   - Set up business account
   - Add click-to-chat button (optional)

### 5. Domain Configuration

#### DNS Records
```
Type    Name    Value                   TTL
A       @       [Your Server IP]        3600
CNAME   www     nestmart.com            3600
```

#### SSL Certificate
- Use Let's Encrypt (free)
- Or use hosting provider's SSL
- Ensure HTTPS redirect is enabled

### 6. Performance Optimization

#### Enable Compression
```apache
# .htaccess
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

#### Browser Caching
```apache
# .htaccess
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### 7. Monitoring Setup

#### Error Tracking
Consider adding:
- Sentry (error tracking)
- LogRocket (session replay)
- New Relic (performance monitoring)

#### Uptime Monitoring
- UptimeRobot (free)
- Pingdom
- StatusCake

### 8. Backup Strategy

- Daily database backups
- Weekly full site backups
- Store backups off-site
- Test restore process monthly

### 9. Security Checklist

- [ ] SSL certificate installed
- [ ] HTTPS redirect enabled
- [ ] Security headers configured
- [ ] Admin area protected
- [ ] API endpoints secured
- [ ] Rate limiting enabled
- [ ] CORS configured properly
- [ ] Environment variables secured

### 10. Maintenance Schedule

#### Daily
- Monitor error logs
- Check uptime status
- Review analytics

#### Weekly
- Check Google Search Console
- Review site speed
- Test critical paths

#### Monthly
- Update dependencies
- Review SEO rankings
- Analyze user behavior
- Update content

#### Quarterly
- Full security audit
- Performance optimization
- Content refresh
- Competitor analysis

## Troubleshooting

### Issue: 404 on page refresh
**Solution**: Configure server for SPA routing (see .htaccess above)

### Issue: Images not loading
**Solution**: Check image paths are relative, verify public folder structure

### Issue: API calls failing
**Solution**: Verify CORS settings, check API URL in environment variables

### Issue: Slow load times
**Solution**: Enable compression, optimize images, use CDN

### Issue: Arabic text not displaying
**Solution**: Verify Cairo font is loading, check RTL CSS

## Support

For deployment issues:
- Email: contact@nestmart.com
- Phone: +201550162282

## Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deployment](https://reactrouter.com/en/main/guides/deployment)
- [Google Search Console](https://search.google.com/search-console)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**Last Updated**: March 1, 2024

**Status**: Ready for Production Deployment ✅
