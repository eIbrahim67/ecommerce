import { useEffect } from "react";

interface SEOProps {
    title: string;
    description: string;
    name?: string;
    type?: string;
}

export default function SEO({ title, description, name = "NestMart", type = "website" }: SEOProps) {
    useEffect(() => {
        // Dynamically update document title
        document.title = title;

        // Helper to update or create meta tags
        const updateMetaTag = (selector: string, attribute: string, value: string) => {
            let element = document.querySelector(selector);
            if (!element) {
                element = document.createElement('meta');
                if (selector.startsWith('meta[name=')) {
                    element.setAttribute('name', selector.split('name="')[1].split('"]')[0]);
                } else if (selector.startsWith('meta[property=')) {
                    element.setAttribute('property', selector.split('property="')[1].split('"]')[0]);
                }
                document.head.appendChild(element);
            }
            element.setAttribute(attribute, value);
        };

        // Standard metadata tags
        updateMetaTag('meta[name="description"]', 'content', description);

        // Open Graph metadata tags
        updateMetaTag('meta[property="og:type"]', 'content', type);
        updateMetaTag('meta[property="og:title"]', 'content', title);
        updateMetaTag('meta[property="og:description"]', 'content', description);
        updateMetaTag('meta[property="og:site_name"]', 'content', name);

        // Twitter metadata tags
        updateMetaTag('meta[name="twitter:creator"]', 'content', name);
        updateMetaTag('meta[name="twitter:card"]', 'content', "summary_large_image");
        updateMetaTag('meta[name="twitter:title"]', 'content', title);
        updateMetaTag('meta[name="twitter:description"]', 'content', description);

    }, [title, description, name, type]);

    return null;
}
