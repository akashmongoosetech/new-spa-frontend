import React, { useEffect, useState } from 'react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export const AdminEmailTemplatesPage: React.FC = () => {
  const [bookingSubject, setBookingSubject] = useState('');
  const [bookingBody, setBookingBody] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactBody, setContactBody] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const s = await api.getFullSettings();
        if (s.bookingEmailSubject) setBookingSubject(s.bookingEmailSubject);
        if (s.contactEmailSubject) setContactSubject(s.contactEmailSubject);
        if (s.bookingEmailTemplate) setBookingBody(s.bookingEmailTemplate);
        if (s.contactEmailTemplate) setContactBody(s.contactEmailTemplate);
        setLoaded(true);
      } catch (err: any) {
        setError(err?.message || 'Could not load the saved templates. Reload before saving.');
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    setSaving(true);
    try {
      await api.updateSettings({
        bookingEmailSubject: bookingSubject,
        contactEmailSubject: contactSubject,
        bookingEmailTemplate: bookingBody,
        contactEmailTemplate: contactBody,
      });
      setSaved(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to save templates.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Email Notification Templates</h1>
        <p className="text-xs text-gray-500 mt-1">Configure automated transactional emails for booking confirmations and contact auto-replies</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
        {saved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Templates saved successfully!</span>
          </div>
        )}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-[11px] leading-relaxed text-teal-900">
          <p className="font-bold mb-1">Supported placeholders</p>
          <p>
            Booking: <code className="font-mono">{'{{customerName}} {{bookingNumber}} {{serviceName}} {{therapistName}} {{date}} {{dateLong}} {{time}} {{duration}} {{total}} {{status}} {{businessName}}'}</code>
          </p>
          <p className="mt-1">
            Contact: <code className="font-mono">{'{{name}} {{email}} {{phone}} {{subject}} {{message}} {{businessName}}'}</code>
          </p>
          <p className="mt-1 text-teal-800">
            The body is inserted into the branded email shell. Full HTML documents are also supported. Leave a subject
            or template blank to use the built-in default.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Booking Confirmation Subject</label>
            <input
              type="text"
              value={bookingSubject}
              onChange={(e) => setBookingSubject(e.target.value)}
              placeholder="Appointment {{status}} — {{bookingNumber}}"
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-[#2CB5A0] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Confirmation Email Body Template</label>
            <textarea
              rows={6}
              value={bookingBody}
              onChange={(e) => setBookingBody(e.target.value)}
              placeholder="Dear {{customerName}},&#10;&#10;Thank you for choosing Tripod Wellness. Your appointment for {{serviceName}} with {{therapistName}} on {{date}} at {{time}} has been confirmed.&#10;&#10;Warm regards,&#10;The Tripod Wellness Concierge Team"
              className="w-full border border-gray-300 rounded-xl p-3 text-sm font-mono text-xs focus:border-[#2CB5A0] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Contact Inquiry Auto-Reply Subject</label>
            <input
              type="text"
              value={contactSubject}
              onChange={(e) => setContactSubject(e.target.value)}
              placeholder="We received your message"
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-[#2CB5A0] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Contact Inquiry Auto-Reply Body</label>
            <textarea
              rows={4}
              value={contactBody}
              onChange={(e) => setContactBody(e.target.value)}
              placeholder="Dear {{name}},&#10;&#10;Thank you for reaching out to Tripod Wellness. Our concierge team will respond within 2 business hours.&#10;&#10;Warm regards,&#10;The Tripod Wellness Concierge Team"
              className="w-full border border-gray-300 rounded-xl p-3 text-sm font-mono text-xs focus:border-[#2CB5A0] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving || !loaded}
            title={!loaded ? 'Load the saved templates before saving.' : undefined}
            className="px-6 py-3 bg-[#2CB5A0] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Templates'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEmailTemplatesPage;
