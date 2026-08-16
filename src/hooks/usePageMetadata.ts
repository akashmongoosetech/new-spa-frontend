import { useEffect } from 'react';
import { updatePageSEO, getSEOPresets, SEOConfig } from '../utils/seo';

/**
 * Custom React Hook to dynamically set document title, meta description,
 * Open Graph image tags, canonical link, and JSON-LD structured data.
 *
 * @param config SEOConfig object or a preset route name string (e.g., 'home', 'services', 'booking')
 * @param overrideConfig Optional overrides when using a preset name
 */
export function usePageMetadata(
  config?: SEOConfig | string,
  overrideConfig?: SEOConfig
) {
  useEffect(() => {
    let finalConfig: SEOConfig = {};

    if (typeof config === 'string') {
      const preset = getSEOPresets(config);
      finalConfig = { ...preset, ...overrideConfig };
    } else if (config) {
      finalConfig = { ...config, ...overrideConfig };
    }

    updatePageSEO(finalConfig);
  }, [config, overrideConfig]);
}

export default usePageMetadata;
