import React from 'react';
import { BRAND_ICON, BRAND_LOGO } from '../../branding/logo';

type BrandLogoVariant = 'icon' | 'full';

export interface BrandLogoProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  variant?: BrandLogoVariant;
}

/**
 * The only renderer for the Tripod Wellness brand mark. Keeping the asset
 * choice here prevents individual screens from drifting back to legacy paths.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'icon',
  alt = 'Tripod Wellness',
  ...props
}) => (
  <img
    src={variant === 'full' ? BRAND_LOGO : BRAND_ICON}
    alt={alt}
    {...props}
  />
);

export default BrandLogo;
