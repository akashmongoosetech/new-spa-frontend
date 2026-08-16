import React, { useState, useEffect } from 'react';
import {
  Settings,
  Mail,
  Search,
  Shield,
  Palette,
  CheckCircle2,
  Save,
  Globe,
  Sliders,
  Bell
} from 'lucide-react';
import { BusinessSettings } from '../../types';
import { api } from '../../services/api';

export const SettingsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'smtp' | 'seo' | 'booking' | 'security' | 'appearance'>('general');
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !settings) {
    return <div className="p-8 text-center text-xs text-gray-500">Loading settings configuration...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">System & Business Settings</h2>
          <p className="text-xs text-gray-500">Configure global business profile, SMTP mailing server, SEO meta tags, and security protocols.</p>
        </div>
        {savedMsg && (
          <div className="px-4 py-2 rounded-xl bg-teal-50 text-[#2CB5A0] font-bold text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Settings Saved Successfully!
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center bg-white p-1.5 rounded-2xl border border-gray-100 shadow-xs text-xs">
        {[
          { id: 'general', label: 'General Info', icon: Settings },
          { id: 'smtp', label: 'Email & SMTP', icon: Mail },
          { id: 'seo', label: 'SEO & Metadata', icon: Globe },
          { id: 'booking', label: 'Booking Rules', icon: Sliders },
          { id: 'security', label: 'Security & Auth', icon: Shield },
          { id: 'appearance', label: 'Appearance & Theme', icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold cursor-pointer transition-all ${
                isActive ? 'bg-[#1A1A1A] text-white shadow-md' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#2CB5A0]' : 'text-gray-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6 text-xs">
        {activeTab === 'general' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-gray-900 text-sm border-b pb-3">Business Profile & Contact Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Business Name</label>
                <input
                  type="text"
                  value={settings.businessName}
                  onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-[#2CB5A0]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Official Phone</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Official Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Physical Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={settings.instagramUrl || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      instagramUrl: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Facebook URL</label>
                <input
                  type="url"
                  value={settings.facebookUrl || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      facebookUrl: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Twitter/X URL</label>
                <input
                  type="url"
                  value={settings.twitterUrl || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      twitterUrl: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'smtp' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-gray-900 text-sm border-b pb-3">SMTP Mail Server Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">SMTP Host Server</label>
                <input
                  type="text"
                  value={settings.smtpHost || 'smtp.auraluxespa.com'}
                  onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">SMTP Port</label>
                <input
                  type="number"
                  value={settings.smtpPort || 587}
                  onChange={(e) => setSettings({ ...settings, smtpPort: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Sender Name</label>
                <input
                  type="text"
                  value={settings.smtpSenderName || 'Aura Luxe Concierge'}
                  onChange={(e) => setSettings({ ...settings, smtpSenderName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Sender Email</label>
                <input
                  type="email"
                  value={settings.smtpSenderEmail || 'concierge@auraluxespa.com'}
                  onChange={(e) => setSettings({ ...settings, smtpSenderEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-gray-900 text-sm border-b pb-3">Search Engine Optimization (SEO)</h3>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Global Meta Title</label>
              <input
                type="text"
                value={settings.metaTitle || ''}
                onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Meta Description</label>
              <textarea
                rows={3}
                value={settings.metaDescription || ''}
                onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                className="w-full p-3 rounded-xl border outline-none"
              ></textarea>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Keywords (Comma separated)</label>
              <input
                type="text"
                value={settings.keywords || ''}
                onChange={(e) => setSettings({ ...settings, keywords: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
              />
            </div>
          </div>
        )}

        {activeTab === 'booking' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-gray-900 text-sm border-b pb-3">Booking Rules & Restrictions</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Advance Booking Window (Days)</label>
                <input
                  type="number"
                  value={settings.advanceBookingDays || 30}
                  onChange={(e) => setSettings({ ...settings, advanceBookingDays: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Cancellation Notice Required (Hours)</label>
                <input
                  type="number"
                  value={settings.cancellationNoticeHours || 4}
                  onChange={(e) => setSettings({ ...settings, cancellationNoticeHours: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800 pt-2">
              <input
                type="checkbox"
                checked={settings.autoApproveBookings}
                onChange={(e) => setSettings({ ...settings, autoApproveBookings: e.target.checked })}
                className="w-4 h-4 text-[#2CB5A0] rounded-md"
              />
              Automatically approve all incoming bookings without pending review
            </label>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-gray-900 text-sm border-b pb-3">Security & Session Protocols</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Session Timeout (Minutes)</label>
                <input
                  type="number"
                  value={settings.sessionTimeoutMinutes || 60}
                  onChange={(e) => setSettings({ ...settings, sessionTimeoutMinutes: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Max Login Attempts Allowed</label>
                <input
                  type="number"
                  value={settings.maxLoginAttempts || 5}
                  onChange={(e) => setSettings({ ...settings, maxLoginAttempts: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-gray-900 text-sm border-b pb-3">Brand Theme & Appearance</h3>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Primary Brand Color Accent</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.primaryColor || '#2CB5A0'}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="w-12 h-10 rounded-lg cursor-pointer border"
                />
                <span className="font-mono text-gray-800">{settings.primaryColor || '#2CB5A0'}</span>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 flex justify-end border-t">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#2CB5A0] hover:bg-teal-600 text-white font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-[#2CB5A0]/20"
          >
            <Save className="w-4 h-4" /> Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
};
