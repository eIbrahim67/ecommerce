import { Helmet } from "react-helmet-async";

interface SEOProps {
    title: string;
    description: string;
    name?: string;
    type?: string;
}

export default function SEO({ title, description, name = "NestMart", type = "website" }: SEOProps) {
    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title}</title>
            <meta name="description" content={description} />

            {/* Open Graph metadata tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={name} />

            {/* Twitter metadata tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
        </Helmet>
    );
}
