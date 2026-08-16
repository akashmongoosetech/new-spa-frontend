import React from 'react';
import { usePageMetadata } from '../../hooks/usePageMetadata';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  path?: string;
  type?: 'website' | 'article' | 'profile' | 'business';
  robots?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  path,
  type = 'website',
  robots,
  jsonLd,
}) => {
  usePageMetadata({
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage,
    path,
    type,
    robots,
    jsonLd,
  });

  return null;
};

export default SEO;
