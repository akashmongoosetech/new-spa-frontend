import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { GalleryPage as OriginalGalleryPage, GalleryPhoto } from '../GalleryPage';
import { mockSettings } from '../../data/mockData';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    (async () => {
      try {
        const gallery = await api.getGallery();
        if (cancelled) return;
        if (!Array.isArray(gallery)) {
          setPhotos([]);
          return;
        }
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
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [retryToken]);

  if (loading && photos.length === 0) {
    return <LoadingSpinner fullScreen label="Opening the gallery..." />;
  }

  if (error && photos.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 py-16">
        <div className="max-w-md rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
          <h1 className="font-serif text-2xl font-bold text-gray-900">Gallery unavailable</h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            The live gallery could not be loaded right now. Please retry, or contact the concierge.
          </p>
          <button
            type="button"
            onClick={() => setRetryToken((value) => value + 1)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-brand-950 hover:bg-brand-400"
          >
            <RefreshCw className="h-4 w-4" /> Try again
          </button>
        </div>
      </div>
    );
  }

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
