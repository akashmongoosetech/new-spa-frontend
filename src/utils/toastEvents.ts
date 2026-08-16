import { ToastMessage } from '../components/ui/Toast';

export type ToastOptions = Omit<ToastMessage, 'id'>;

/**
 * Triggers a toast notification anywhere in the application.
 */
export const showToast = (options: ToastOptions) => {
  const event = new CustomEvent('aura-toast', { detail: options });
  window.dispatchEvent(event);
};

/**
 * Broadcasts a new booking event across the client application and multi-tabs.
 */
export const broadcastNewBooking = (booking: any) => {
  // Dispatch custom window event
  const event = new CustomEvent('aura-new-booking', { detail: { booking } });
  window.dispatchEvent(event);

  // Store in localStorage so other open tabs receive storage event
  try {
    localStorage.setItem(
      'aura_latest_booking',
      JSON.stringify({ booking, timestamp: Date.now() })
    );
  } catch (err) {
    // Ignore storage quota errors
  }
};

/**
 * Synthesizes a subtle, luxury audio chime for toast notifications.
 */
export const playNotificationSound = (type: 'success' | 'admin_alert' | 'info' = 'success') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'admin_alert') {
      // Elegant dual-tone chime for admin incoming booking alert
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } else if (type === 'success') {
      // Soft ascending major third chime for successful booking
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else {
      // Gentle subtle ping for info
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (err) {
    // Autoplay restrictions may suppress sound before first gesture; silently handle
  }
};
