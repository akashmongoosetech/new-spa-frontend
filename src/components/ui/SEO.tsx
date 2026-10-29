import React from 'react';
import { usePageMetadata } from '../../hooks/usePageMetadata';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: string;
  path?: string;
  type?: 'website' | 'article' | 'profile' | 'business';
  robots?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleSection?: string;
  articleTags?: string[];
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  ogImageAlt,
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterCard,
  path,
  type = 'website',
  robots,
  articlePublishedTime,
  articleModifiedTime,
  articleSection,
  articleTags,
  jsonLd,
}) => {
  usePageMetadata({
    title,
    description,
    keywords,
    canonicalUrl,
    ogTitle,
    ogDescription,
    ogImage,
    ogImageAlt,
    twitterTitle,
    twitterDescription,
    twitterImage,
    twitterCard,
    path,
    type,
    robots,
    articlePublishedTime,
    articleModifiedTime,
    articleSection,
    articleTags,
    jsonLd,
  });

  return null;
};

export default SEO;
