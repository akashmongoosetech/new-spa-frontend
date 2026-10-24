import React from 'react';

export interface LoadingSpinnerProps {
  /** If true, centers the spinner within a full-viewport container */
  fullScreen?: boolean;
  /** Size variant for the spinner ring */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Primary status message shown below spinner */
  label?: string;
  /** Optional secondary text for extra context */
  sublabel?: string;
  /** Theme styling variant for background & contrast */
  variant?: 'gold' | 'dark' | 'light';
  /** Custom additional wrapper classes */
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullScreen = false,
  size = 'md',
  label = 'Loading sanctuary experiences...',
  sublabel,
  variant = 'gold',
  className = '',
}) => {
  // Dimensions map
  const sizeMap = {
    sm: { container: 'w-8 h-8', outerRing: 'w-8 h-8 border-2', innerDot: 'w-2 h-2', icon: 'w-3 h-3' },
    md: { container: 'w-14 h-14', outerRing: 'w-14 h-14 border-[2.5px]', innerDot: 'w-3.5 h-3.5', icon: 'w-5 h-5' },
    lg: { container: 'w-20 h-20', outerRing: 'w-20 h-20 border-3', innerDot: 'w-5 h-5', icon: 'w-7 h-7' },
    xl: { container: 'w-28 h-28', outerRing: 'w-28 h-28 border-4', innerDot: 'w-7 h-7', icon: 'w-9 h-9' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Background style if full screen
  const containerBg =
    variant === 'dark'
      ? 'bg-[#17130F] text-white'
      : variant === 'light'
      ? 'bg-white text-gray-900'
      : 'bg-[#FAF8F5] text-[#1C1917]'; // Brand pearl/cream

  const content = (
    <div
      role="status"
      aria-label={label || 'Loading...'}
      className={`flex flex-col items-center justify-center gap-4 p-6 text-center select-none ${className}`}
    >
      {/* Animated Gold Ring Assembly */}
      <div className={`relative ${currentSize.container} flex items-center justify-center`}>
        {/* Outer glowing pulsing aura */}
        <div
          className={`absolute inset-0 rounded-full bg-[#BFA476]/20 blur-md animate-pulse`}
          style={{ animationDuration: '2s' }}
        />

        {/* Outer subtle static ring */}
        <div className={`absolute inset-0 rounded-full border border-[#BFA476]/20`} />

        {/* Primary spinning gradient ring */}
        <div
          className={`absolute inset-0 rounded-full ${currentSize.outerRing} border-t-[#BFA476] border-r-[#C3AA7E] border-b-[#80663F] border-l-transparent animate-spin`}
          style={{ animationDuration: '0.85s' }}
        />

        {/* Secondary counter-spinning inner accent ring */}
        <div
          className={`absolute inset-2 rounded-full border-2 border-b-[#C3AA7E] border-l-[#BFA476] border-t-transparent border-r-transparent animate-spin`}
          style={{ animationDirection: 'reverse', animationDuration: '1.4s' }}
        />

        {/* Center glowing brand ornament / dot */}
        <div className="relative flex items-center justify-center">
          <div
            className={`${currentSize.innerDot} rounded-full bg-linear-to-tr from-[#80663F] via-[#BFA476] to-[#C3AA7E] shadow-[0_0_12px_rgba(197,160,89,0.8)] animate-pulse`}
          />
        </div>
      </div>

      {/* Label and Sublabel */}
      {(label || sublabel) && (
        <div className="flex flex-col items-center gap-1 max-w-xs">
          {label && (
            <p className="font-serif text-sm md:text-base font-medium tracking-wider text-[#2E2417] dark:text-[#EADCC4] animate-pulse">
              {label}
            </p>
          )}
          {sublabel && (
            <p className="text-xs tracking-widest uppercase text-[#80663F] dark:text-[#BFA476] font-sans opacity-80">
              {sublabel}
            </p>
          )}
        </div>
      )}

      {/* Screen reader text */}
      <span className="sr-only">{label || 'Loading content...'}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 min-h-screen w-full flex items-center justify-center ${containerBg} z-50 transition-opacity duration-300`}>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
