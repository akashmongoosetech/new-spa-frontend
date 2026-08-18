import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { GalleryPage as OriginalGalleryPage, GalleryPhoto } from '../GalleryPage';
import { mockSettings } from '../../data/mockData';
import { api } from '../../services/api';

const CATEGORY_LABELS: Record<string, string> = {
  suites: 'VIP Suites',
  hydrotherapy: 'Hydrotherapy & Steam',
  equipment: 'Professional Equipment',
  ambiance: 'Ambiance & Lounge',
};

export const GalleryPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const context = useOutletContext<{
    settings?: typeof mockSettings;
    onOpenBooking?: (serviceId?: string) => void;
  }>() || {};

  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const g = await api.getGallery();
        if (!Array.isArray(g)) return;
        const mapped: GalleryPhoto[] = g.map((item) => ({
          id: item.id,
          title: item.title || 'Sanctuary Feature',
          subtitle: item.subtitle || '',
          category: (['suites', 'equipment', 'ambiance', 'hydrotherapy'].includes(item.category) ? item.category : 'ambiance') as GalleryPhoto['category'],
          categoryLabel: item.categoryLabel || item.category_label || CATEGORY_LABELS[item.category] || 'Sanctuary',
          url: item.imageUrl || item.image_url || '',
          description: item.description || '',
          highlights: Array.isArray(item.highlights) ? item.highlights : [],
          dimensions: item.dimensions || '',
          sanitizationLevel: item.sanitizationLevel || item.sanitization_level || '',
        }));
        setPhotos(mapped.filter((p) => p.url));
      } catch (err) {
        // keep empty state
      }
    })();
  }, []);

  return (
    <OriginalGalleryPage
      settings={context.settings || mockSettings}
      photos={photos}
      onOpenBooking={context.onOpenBooking || (() => {})}
      setActiveTab={(tab) => {
        if (tab === 'home') navigate('/');
        else navigate(`/${tab}`);
      }}
    />
  );
};

export default GalleryPageWrapper;