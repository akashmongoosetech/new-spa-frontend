import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { GalleryPage as OriginalGalleryPage, GalleryPhoto } from '../GalleryPage';
import { mockSettings } from '../../data/mockData';
import { api } from '../../services/api';

const CATEGORY_LABELS: Record<string, string> = {
  suites: 'Therapy Rooms',
  hydrotherapy: 'Hydrotherapy',
  equipment: 'Equipment',
  ambiance: 'Ambiance',
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
        const gallery = await api.getGallery();
        if (!Array.isArray(gallery)) return;
        const mapped: GalleryPhoto[] = gallery
          .filter((item) => item.imageUrl || item.image_url)
          .map((item) => ({
            id: item.id,
            title: item.title || 'Facility photo',
            subtitle: item.subtitle || '',
            category: (['suites', 'equipment', 'ambiance', 'hydrotherapy'].includes(item.category)
              ? item.category
              : 'ambiance') as GalleryPhoto['category'],
            categoryLabel:
              item.categoryLabel ||
              item.category_label ||
              CATEGORY_LABELS[item.category] ||
              'Facility',
            url: item.imageUrl || item.image_url || '',
            description: item.description || '',
          }));
        setPhotos(mapped);
      } catch (err) {
        // The gallery shows an honest empty state when the API is unavailable.
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
