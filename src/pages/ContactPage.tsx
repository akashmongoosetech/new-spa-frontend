import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, CheckCircle2 } from 'lucide-react';
import { BusinessSettings } from '../types';
import { api } from '../services/api';
import { SEO } from '../components/ui/SEO';

interface ContactPageProps {
  settings: BusinessSettings;
  onOpenBooking?: () => void;
  setActiveTab?: (tab: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    try {
      await api.sendContact({ name, email, phone, subject, message });
      setSentSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-[#FAFAFA] font-sans min-h-screen">
      <SEO title="Contact & Location | Aura Luxe Spa Bandra West" description="Get in touch with Aura Luxe Concierge. Phone, email, WhatsApp, and location directions." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2CB5A0] bg-teal-50 px-3 py-1 rounded-full">
            Concierge Desk
          </span>
          <h1 className="text-4xl font-serif font-bold text-gray-900">
            Contact & Executive Reservations
          </h1>
          <p className="text-xs text-gray-600">
            Have questions regarding custom therapy packages, corporate group bookings, or private suite availability?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-gray-900 border-b pb-3">
                Spa Location & Contact Info
              </h3>

              <div className="space-y-4 text-xs text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#2CB5A0] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900 block">Bandra West Sanctuary</span>
                    <span>{settings.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#2CB5A0] shrink-0" />
                  <div>
                    <span className="font-bold text-gray-900 block">Telephone Hotline</span>
                    <a href={`tel:${settings.phone}`} className="hover:text-[#2CB5A0]">{settings.phone}</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#2CB5A0] shrink-0" />
                  <div>
                    <span className="font-bold text-gray-900 block">Concierge Email</span>
                    <a href={`mailto:${settings.email}`} className="hover:text-[#2CB5A0]">{settings.email}</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#C7A36A] shrink-0" />
                  <div>
                    <span className="font-bold text-gray-900 block">Operating Hours</span>
                    <span>{settings.workingHours}</span>
                  </div>
                </div>
              </div>

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
            </div>

            {/* Google Maps Container */}
            <div className="bg-slate-900 rounded-3xl overflow-hidden h-60 border border-gray-800 relative flex items-center justify-center p-6 text-center">
              <div className="space-y-2 text-white">
                <MapPin className="w-8 h-8 text-[#2CB5A0] mx-auto animate-bounce" />
                <h4 className="font-serif font-bold text-base">Bandra West Location Map</h4>
                <p className="text-xs text-gray-400">{settings.address}</p>
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-2 px-4 py-2 rounded-xl bg-[#2CB5A0] text-white font-bold text-xs hover:bg-[#259b89]"
                >
                  Open Google Maps Directions
                </a>
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
                Receive an executive response within 2 business hours.
              </p>

              {sentSuccess ? (
                <div className="p-6 rounded-2xl bg-teal-50 border border-[#2CB5A0] text-[#1A1A1A] space-y-2 text-center">
                  <CheckCircle2 className="w-10 h-10 text-[#2CB5A0] mx-auto" />
                  <h4 className="font-serif font-bold text-lg">Inquiry Dispatched Successfully!</h4>
                  <p className="text-xs text-gray-600">
                    Thank you. We have sent a confirmation email copy to your inbox.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && <p className="text-xs font-bold text-rose-500">{errorMessage}</p>}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#2CB5A0]"
                        placeholder="Arthur Pendelton"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#2CB5A0]"
                        placeholder="arthur@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#2CB5A0]"
                        placeholder="+1 (310) 555-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#2CB5A0]"
                        placeholder="Group Reservation Query"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#2CB5A0]"
                      placeholder="Write your inquiry or question here..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-[#2CB5A0] hover:bg-[#259b89] text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{submitting ? 'Sending Message...' : 'Submit Concierge Message'}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
