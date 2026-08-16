/**
 * SEO & Meta Tag Management Utility for Aura Luxe Spa
 * Handles dynamic HTML meta tags, Open Graph card images, Twitter meta tags,
 * canonical link injection, and Schema.org JSON-LD structured data.
 */

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  favicon?: string;
  canonicalUrl?: string;
  path?: string;
  type?: 'website' | 'article' | 'profile' | 'business';
  robots?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_SEO: Required<Omit<SEOConfig, 'jsonLd' | 'path'>> = {
  title: "Aura Luxe Spa | Premier Men's Massage Therapy & Wellness Sanctuary Bandra",
  description: "Licensed Men-to-Men massage therapy sanctuary in Bandra West, Mumbai. Deep Tissue, Swedish, Ayurvedic Abhyanga, and Hot Stone in private soundproof suites.",
  keywords: "men to men massage Mumbai, male massage therapist Bandra, deep tissue massage Mumbai, Ayurvedic Abhyanga, male spa Mumbai, male wellness sanctuary",
  ogImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop",
  favicon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✨</text></svg>',
  canonicalUrl: "https://auraluxespa.in",
  type: "website",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
};

export const BASE_URL = "https://auraluxespa.in";

/**
 * Dynamically sets or updates meta tags, Open Graph images, canonical links, and JSON-LD schema.
 */
export const updatePageSEO = (config: SEOConfig = {}) => {
  if (typeof window === 'undefined') return;

  const title = config.title || DEFAULT_SEO.title;
  const description = config.description || DEFAULT_SEO.description;
  const keywords = config.keywords || DEFAULT_SEO.keywords;
  const ogImage = config.ogImage || DEFAULT_SEO.ogImage;
  const type = config.type || DEFAULT_SEO.type;
  const robots = config.robots || DEFAULT_SEO.robots;

  // Resolve Canonical URL
  let canonicalUrl = config.canonicalUrl;
  if (!canonicalUrl) {
    const currentPath = config.path || window.location.pathname;
    canonicalUrl = `${BASE_URL}${currentPath === '/' ? '' : currentPath}`;
  }

  // 1. Update Document Title
  document.title = title;

  // 2. Helper to set/update meta tag
  const setMeta = (attrName: 'name' | 'property', attrVal: string, contentVal: string) => {
    if (!contentVal) return;
    let elem = document.querySelector(`meta[${attrName}="${attrVal}"]`);
    if (!elem) {
      elem = document.createElement('meta');
      elem.setAttribute(attrName, attrVal);
      document.head.appendChild(elem);
    }
    elem.setAttribute('content', contentVal);
  };

  // Standard Meta Tags
  setMeta('name', 'description', description);
  setMeta('name', 'keywords', keywords);
  setMeta('name', 'robots', robots);

  // Open Graph (Facebook / WhatsApp / LinkedIn / iMessage)
  setMeta('property', 'og:site_name', 'Aura Luxe Spa & Wellness Sanctuary');
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:type', type);
  setMeta('property', 'og:url', canonicalUrl);
  setMeta('property', 'og:image', ogImage);
  setMeta('property', 'og:image:width', '1200');
  setMeta('property', 'og:image:height', '630');
  setMeta('property', 'og:locale', 'en_IN');

  // Twitter Cards
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:site', '@AuraLuxeSpa');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', ogImage);

  // 3. Update Canonical Link
  let linkCanonical = document.querySelector('link[rel="canonical"]');
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.setAttribute('href', canonicalUrl);

  // 4. Update Favicon Link
  const favicon = config.favicon || DEFAULT_SEO.favicon;
  let linkFavicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]') as HTMLLinkElement;
  if (!linkFavicon) {
    linkFavicon = document.createElement('link');
    linkFavicon.setAttribute('rel', 'icon');
    document.head.appendChild(linkFavicon);
  }
  linkFavicon.setAttribute('href', favicon);

  // 4. Inject or Update Schema.org JSON-LD Structured Data
  const defaultBusinessSchema = generateLocalBusinessSchema();

  const activeJsonLd = config.jsonLd ? config.jsonLd : defaultBusinessSchema;

  let scriptTag = document.getElementById('json-ld-spa-schema') as HTMLScriptElement;
  if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.id = 'json-ld-spa-schema';
    scriptTag.type = 'application/ld+json';
    document.head.appendChild(scriptTag);
  }
  scriptTag.textContent = JSON.stringify(activeJsonLd);
};

/**
 * Generates rich Schema.org LocalBusiness / DaySpa JSON-LD structured data tailored for a luxury massage & spa sanctuary.
 */
export const generateLocalBusinessSchema = (customData?: Record<string, any>): Record<string, any> => {
  return {
    "@context": "https://schema.org",
    "@type": ["DaySpa", "HealthAndBeautyBusiness", "LocalBusiness"],
    "@id": `${BASE_URL}/#spa-business`,
    "name": "Aura Luxe Spa & Wellness Sanctuary",
    "alternateName": "Aura Luxe Men's Wellness Sanctuary",
    "description": "Licensed Men-to-Men luxury massage therapy sanctuary in Bandra West, Mumbai. Offering deep tissue muscle recovery, Swedish relaxation, Ayurvedic Abhyanga, and volcanic hot stone therapies in private soundproof VIP suites.",
    "url": BASE_URL,
    "telephone": "+919820012345",
    "email": "concierge@auraluxespa.in",
    "priceRange": "₹₹₹",
    "currenciesAccepted": "INR",
    "paymentAccepted": "Cash, Credit Card, Debit Card, UPI, Net Banking",
    "logo": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=500&auto=format&fit=crop",
    "image": [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1200&auto=format&fit=crop"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Plot 42, Bandra Reclamation, Bandra West",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "postalCode": "400050",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 19.0596,
      "longitude": 72.8295
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "09:00",
        "closes": "22:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "348",
      "bestRating": "5",
      "worstRating": "1"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Luxury Massage & Therapy Menu",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Deep Tissue Muscle Recovery",
            "description": "Targeted myofascial release focusing on chronic muscle knots and post-workout soreness.",
            "provider": { "@id": `${BASE_URL}/#spa-business` }
          },
          "price": "3500",
          "priceCurrency": "INR"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Swedish Relaxation Massage",
            "description": "Classic gentle gliding strokes with cold-pressed organic botanical oils for supreme stress relief.",
            "provider": { "@id": `${BASE_URL}/#spa-business` }
          },
          "price": "3000",
          "priceCurrency": "INR"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Ayurvedic Abhyanga Therapy",
            "description": "Traditional warm herbal oil rhythmic bodywork restoring dosha harmony and energy vitality.",
            "provider": { "@id": `${BASE_URL}/#spa-business` }
          },
          "price": "4000",
          "priceCurrency": "INR"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Volcanic Hot Stone Therapy",
            "description": "Heated basalt stones placed along energy meridians to melt deep muscular stiffness.",
            "provider": { "@id": `${BASE_URL}/#spa-business` }
          },
          "price": "4500",
          "priceCurrency": "INR"
        }
      ]
    },
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Private Soundproof VIP Suites",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "En-suite Rainfall Showers",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Ergonomic Heated Therapy Tables",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Hospital-grade UV Hygiene Sanitization",
        "value": true
      }
    ],
    ...customData,
  };
};

/**
 * Returns SEO metadata presets for key application routes
 */
export const getSEOPresets = (pageName: string, params?: Record<string, any>): SEOConfig => {
  switch (pageName) {
    case 'home':
      return {
        title: "Aura Luxe Spa | Luxury Men's Massage Therapy Bandra West, Mumbai",
        description: "Experience executive male wellness in private soundproof suites. Certified male therapists, deep tissue muscle recovery, Swedish relaxation, and hot stone therapy.",
        ogImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop",
        path: "/",
      };
    case 'services':
      return {
        title: "Massage Therapies & Pricing Menu | Aura Luxe Spa Bandra",
        description: "Explore our signature therapies including Deep Tissue Recovery, Swedish Relaxation, Ayurvedic Abhyanga, and Eucalyptus Steam. Transparent pricing and private suites.",
        ogImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop",
        path: "/services",
      };
    case 'booking':
      return {
        title: "Book VIP Suite Session Online | Aura Luxe Spa Reserve",
        description: "Select therapist, date, time slot, and treatment package in under 60 seconds. Instant booking confirmation for private VIP therapy suites in Bandra West.",
        ogImage: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1200&auto=format&fit=crop",
        path: "/booking",
      };
    case 'gallery':
      return {
        title: "Sanctuary Suites & Equipment Gallery | Aura Luxe Spa",
        description: "High-resolution photo tour of our VIP therapy suites, volcanic hot stone warmers, hydrotherapy tubs, and hospital-grade sanitized facilities.",
        ogImage: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1200&auto=format&fit=crop",
        path: "/gallery",
      };
    case 'therapists':
      return {
        title: "Certified Male Massage Therapists | Aura Luxe Spa Staff",
        description: "Meet our licensed male massage specialists trained in deep tissue, sports kinesiology, and Ayurvedic bodywork.",
        ogImage: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1200&auto=format&fit=crop",
        path: "/therapists",
      };
    case 'blog':
      return {
        title: "Men's Health & Massage Therapy Blog | Aura Luxe Insights",
        description: "Expert articles on posture correction, muscle tension recovery, hot stone therapy benefits, and stress relief for modern gentlemen.",
        ogImage: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200&auto=format&fit=crop",
        path: "/blog",
      };
    default:
      return {};
  }
};
