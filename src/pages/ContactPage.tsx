import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { BusinessSettings } from '../types';
import { api } from '../services/api';
import { publicWorkingHours } from '../utils/settings';
import { markConversionPending } from '../utils/analytics';

interface ContactPageProps {
  settings: BusinessSettings;
  onOpenBooking?: () => void;
  setActiveTab?: (tab: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (website) {
      setErrorMessage('Unable to submit this message.');
      return;
    }
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!consent) {
      setErrorMessage('Please agree to the Privacy Policy before sending this message.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    try {
      await api.sendContact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
        consent: true,
        website,
      });
      markConversionPending('contact');
      navigate('/thank-you?type=contact', { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-[#FAFAFA] font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-ink)] bg-brand-50 px-3 py-1 rounded-full">
            Concierge Desk
          </span>
          <h1 className="text-4xl font-serif font-bold text-gray-900">
            Contact the Concierge
          </h1>
          <p className="text-xs text-gray-600">
            Ask about therapies, appointment availability, accessibility or directions. The concierge
            will reply using the contact details you provide.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-gray-900 border-b pb-3">
                Concierge & Service Area
              </h3>

              <div className="space-y-4 text-xs text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[var(--brand-ink)] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900 block">Service area</span>
                    <span>{settings.address || 'Indore, Ujjain & Dewas'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[var(--brand-ink)] shrink-0" />
                  <div>
                    <span className="font-bold text-gray-900 block">Mobile</span>
                    <a href={`tel:${settings.phone}`} className="hover:text-[var(--brand-ink)]">{settings.phone}</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[var(--brand-ink)] shrink-0" />
                  <div>
                    <span className="font-bold text-gray-900 block">Concierge Email</span>
                    <a href={`mailto:${settings.email}`} className="hover:text-[var(--brand-ink)]">{settings.email}</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[var(--brand-ink)] shrink-0" />
                  <div>
                    <span className="font-bold text-gray-900 block">Operating Hours</span>
                    <span>{publicWorkingHours(settings.workingHours)}</span>
                  </div>
                </div>
              </div>

              {settings.whatsapp && (
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp Directly</span>
                  </a>
                </div>
              )}
            </div>

            {/* Google Maps Container */}
            <div className="on-dark-brand bg-[#1B1611] rounded-3xl overflow-hidden h-60 border border-[#BFA476]/15 relative flex items-center justify-center p-6 text-center">
              <div className="space-y-2 text-white">
                <MapPin className="w-8 h-8 text-[var(--brand-ink)] mx-auto animate-bounce" />
                <h4 className="font-serif font-bold text-base">Service Area</h4>
                <p className="text-xs text-gray-400">
                  {settings.address || 'Indore, Ujjain & Dewas'}
                </p>
                {settings.googleMapsUrl && (
                  <a
                    href={settings.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block rounded-xl bg-brand-500 px-4 py-2 text-xs font-bold text-brand-950 hover:bg-brand-400"
                  >
                    Open map search
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-md">
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                Send Concierge Inquiry
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Send a message and the concierge will reply using the contact details you provide.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
                {errorMessage && (
                  <p role="alert" className="text-xs font-bold text-rose-500">
                    {errorMessage}
                  </p>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-1 block text-xs font-bold text-gray-700">
                      Your Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      maxLength={120}
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border px-4 py-2.5 text-xs focus:border-[#BFA476] focus:outline-none"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-1 block text-xs font-bold text-gray-700">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      maxLength={254}
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border px-4 py-2.5 text-xs focus:border-[#BFA476] focus:outline-none"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-phone" className="mb-1 block text-xs font-bold text-gray-700">
                      Phone Number (optional)
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      maxLength={30}
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border px-4 py-2.5 text-xs focus:border-[#BFA476] focus:outline-none"
                      placeholder="+91 91716 06807"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="mb-1 block text-xs font-bold text-gray-700">
                      Subject (optional)
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      maxLength={160}
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-xl border px-4 py-2.5 text-xs focus:border-[#BFA476] focus:outline-none"
                      placeholder="Appointment question"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-1 block text-xs font-bold text-gray-700">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    maxLength={5000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border px-4 py-2.5 text-xs focus:border-[#BFA476] focus:outline-none"
                    placeholder="Write your question here..."
                  />
                </div>

                <label htmlFor="contact-consent" className="flex items-start gap-2 text-[11px] leading-relaxed text-gray-600">
                  <input
                    id="contact-consent"
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#BFA476]"
                  />
                  <span>
                    I agree to the{' '}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[var(--brand-ink)] underline underline-offset-2"
                    >
                      Privacy Policy
                    </a>{' '}
                    and to being contacted about this message.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-500 py-3.5 text-xs font-bold text-brand-950 shadow-md transition-colors hover:bg-brand-400"
                >
                  <span>{submitting ? 'Sending message...' : 'Send Message'}</span>
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
