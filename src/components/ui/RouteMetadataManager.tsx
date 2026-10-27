import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getRouteMeta,
  getStaticRouteMeta,
  isPrivatePath,
  normalizePath,
} from '../../config/site';
import { updatePageSEO } from '../../utils/seo';

const NOT_FOUND_TITLE = 'Page Not Found | Tripod Wellness';
const NOT_FOUND_DESCRIPTION =
  'The page you requested could not be found. Return to Tripod Wellness or browse therapies, therapists, booking and contact pages.';

export const RouteMetadataManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const path = normalizePath(location.pathname);
    const exact = getStaticRouteMeta(path);

    if (path === '/privacy') {
      const privacy = getStaticRouteMeta('/privacy-policy');
      updatePageSEO({
        title: privacy?.title,
        description: privacy?.description,
        path: '/privacy-policy',
        robots: 'noindex, nofollow',
      });
      return;
    }

    if (isPrivatePath(path)) {
      updatePageSEO({
        title: exact?.title || 'Staff Portal | Tripod Wellness',
        description:
          exact?.description ||
          'Secure staff access for Tripod Wellness. This page is not indexed by search engines.',
        path,
        robots: 'noindex, nofollow',
      });
      return;
    }

    const meta = getRouteMeta(path);
    if (!meta) {
      updatePageSEO({
        title: NOT_FOUND_TITLE,
        description: NOT_FOUND_DESCRIPTION,
        path,
        robots: 'noindex, nofollow',
      });
      return;
    }

    // Detail pages load a record before rendering and set their own unique
    // title/description. Do not overwrite those values with the parent page
    // metadata when the route changes.
    if (/^\/(?:services|therapists|blog)\/[^/]+$/.test(path)) return;

    updatePageSEO({
      title: meta.title,
      description: meta.description,
      path,
      robots: meta.robots,
    });
  }, [location.pathname]);

  return null;
};

export default RouteMetadataManager;
