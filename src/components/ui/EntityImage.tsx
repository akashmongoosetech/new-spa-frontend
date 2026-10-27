import React from 'react';
import { Sparkles } from 'lucide-react';
import { isUnverifiedStockImage } from '../../utils/media';

interface EntityImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  label?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * Renders owner-supplied imagery. Known stock/generated images are replaced by
 * a branded placeholder rather than being presented as Tripod Wellness photos.
 */
export const EntityImage: React.FC<EntityImageProps> = ({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  label = 'Tripod Wellness',
  loading = 'lazy',
}) => {
  if (!src || isUnverifiedStockImage(src)) {
    return (
      <div
        role="img"
        aria-label={`${alt} — illustrative placeholder`}
        className={`flex flex-col items-center justify-center gap-3 bg-linear-to-br from-[#1B1611] via-[#2A221A] to-[#120F0B] text-center text-[var(--brand-ink)] ${placeholderClassName || className}`}
      >
        <Sparkles className="h-8 w-8" aria-hidden="true" />
        <span className="max-w-[85%] text-[10px] font-bold uppercase tracking-[0.18em]">
          {label}
        </span>
        <span className="text-[10px] font-medium text-gray-400">Photo coming soon</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      referrerPolicy="no-referrer"
    />
  );
};

export default EntityImage;
