/** Light (admin console) vs dark (sanctuary / auth layout) tones. */
export type ProfileTone = 'light' | 'dark';

export const cardClass = (tone: ProfileTone): string =>
  tone === 'dark'
    ? 'rounded-2xl border border-white/10 bg-[#161a23]/90 shadow-xl shadow-black/30 backdrop-blur'
    : 'rounded-2xl border border-gray-200 bg-white shadow-sm';

export const sectionTitleClass = (tone: ProfileTone): string =>
  tone === 'dark'
    ? 'flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400'
    : 'flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500';

export const labelClass = (_tone: ProfileTone): string =>
  'mb-1.5 flex items-center gap-1 text-xs font-bold uppercase text-gray-400';

export const inputClassFor = (tone: ProfileTone): string =>
  tone === 'dark'
    ? 'w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white placeholder:text-gray-500 focus:border-[#2CB5A0] focus:outline-none focus:ring-1 focus:ring-[#2CB5A0]'
    : 'w-full rounded-xl border border-gray-300 bg-white p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#2CB5A0] focus:outline-none focus:ring-1 focus:ring-[#2CB5A0]';

export const mutedText = (tone: ProfileTone): string =>
  tone === 'dark' ? 'text-gray-400' : 'text-gray-500';

export const strongText = (tone: ProfileTone): string =>
  tone === 'dark' ? 'text-white' : 'text-gray-900';

export const bodyText = (tone: ProfileTone): string =>
  tone === 'dark' ? 'text-gray-300' : 'text-gray-700';

export const dividerClass = (tone: ProfileTone): string =>
  tone === 'dark' ? 'border-white/10' : 'border-gray-200';
