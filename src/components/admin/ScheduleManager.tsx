import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar as CalendarIcon,
  AlertTriangle,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Lock,
  Sun
} from 'lucide-react';
import { ScheduleConfig } from '../../types';
import { api } from '../../services/api';

export const ScheduleManager: React.FC = () => {
  const [config, setConfig] = useState<ScheduleConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Holiday Form
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayTitle, setNewHolidayTitle] = useState('');

  // New Blocked Date Form
  const [newBlockedDate, setNewBlockedDate] = useState('');

  // New Time Slot
  const [newSlotTime, setNewSlotTime] = useState('');

  // Draft states for inline text/time inputs (saved on blur to avoid per-keystroke API calls)
  const [openDraft, setOpenDraft] = useState('');
  const [closeDraft, setCloseDraft] = useState('');
  const [reasonDraft, setReasonDraft] = useState('');

  useEffect(() => {
    fetchSchedule();
  }, []);

  useEffect(() => {
    if (!config) return;
    setOpenDraft(config.workingHoursStart || '');
    setCloseDraft(config.workingHoursEnd || '');
    setReasonDraft(config.emergencyClosureReason || '');
  }, [config]);

  const fetchSchedule = async () => {
    try {
      const data = await api.getScheduleConfig();
      setConfig(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (updated: Partial<ScheduleConfig>) => {
    if (!config) return;
    try {
      const saved = await api.updateScheduleConfig(updated);
      setConfig(saved);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config || !newHolidayDate || !newHolidayTitle) return;
    const holidays = [...config.holidays, { date: newHolidayDate, title: newHolidayTitle }];
    handleSaveConfig({ holidays });
    setNewHolidayDate('');
    setNewHolidayTitle('');
  };

  const handleRemoveHoliday = (date: string) => {
    if (!config) return;
    const holidays = (config.holidays || []).filter((h) => h.date !== date);
    handleSaveConfig({ holidays });
  };

  const handleAddBlockedDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config || !newBlockedDate) return;
    if (config.blockedDates.includes(newBlockedDate)) return;
    const blockedDates = [...config.blockedDates, newBlockedDate];
    handleSaveConfig({ blockedDates });
    setNewBlockedDate('');
  };

  const handleRemoveBlockedDate = (date: string) => {
    if (!config) return;
    const blockedDates = (config.blockedDates || []).filter((d) => d !== date);
    handleSaveConfig({ blockedDates });
  };

  const handleAddTimeSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config || !newSlotTime) return;
    if ((config.timeSlots || []).includes(newSlotTime)) return;
    const timeSlots = [...(config.timeSlots || []), newSlotTime];
    handleSaveConfig({ timeSlots });
    setNewSlotTime('');
  };

  const handleRemoveTimeSlot = (slot: string) => {
    if (!config) return;
    const timeSlots = (config.timeSlots || []).filter((s) => s !== slot);
    handleSaveConfig({ timeSlots });
  };

  if (loading || !config) {
    return <div className="p-8 text-center text-xs text-gray-500">Loading schedule configuration...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Schedule & Calendar Control</h2>
          <p className="text-xs text-gray-500">Manage spa business hours, holiday closures, emergency lockdowns, and available time slots.</p>
        </div>
        {saveSuccess && (
          <div className="px-4 py-2 rounded-xl bg-teal-50 text-[#2CB5A0] font-bold text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Schedule Updated!
          </div>
        )}
      </div>

      {/* Emergency Lockdown Switch */}
      <div className="p-6 bg-gradient-to-r from-rose-900 to-rose-950 text-white rounded-3xl border border-rose-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-wide">Emergency Spa Closure Override</h3>
              <p className="text-xs text-rose-200 mt-0.5">Instantly block all incoming client online bookings for emergencies or private VIP events.</p>
            </div>
          </div>
          <button
            onClick={() => handleSaveConfig({ emergencyClosure: !config.emergencyClosure })}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
              config.emergencyClosure ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {config.emergencyClosure ? 'Closure Active (Click to Disable)' : 'Enable Emergency Closure'}
          </button>
        </div>

        {config.emergencyClosure && (
          <div className="pt-2">
            <label className="block text-xs font-bold text-rose-200 mb-1">Public Alert Reason shown to clients</label>
            <input
              type="text"
              value={reasonDraft}
              onChange={(e) => setReasonDraft(e.target.value)}
              onBlur={() => {
                if (reasonDraft !== config.emergencyClosureReason) handleSaveConfig({ emergencyClosureReason: reasonDraft });
              }}
              placeholder="e.g. Spa temporarily closed for exclusive private VIP executive event."
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-rose-700 text-white text-xs outline-none"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Working Hours & Time Slots */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b pb-3">
            <Clock className="w-5 h-5 text-[#2CB5A0]" />
            <h3 className="font-extrabold text-gray-900 text-sm">Working Hours & Available Slots</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Daily Opening Hour</label>
              <input
                type="time"
                value={openDraft}
                onChange={(e) => setOpenDraft(e.target.value)}
                onBlur={() => {
                  if (openDraft !== config.workingHoursStart) handleSaveConfig({ workingHoursStart: openDraft });
                }}
                className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Daily Closing Hour</label>
              <input
                type="time"
                value={closeDraft}
                onChange={(e) => setCloseDraft(e.target.value)}
                onBlur={() => {
                  if (closeDraft !== config.workingHoursEnd) handleSaveConfig({ workingHoursEnd: closeDraft });
                }}
                className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none"
              />
            </div>
          </div>

          {/* Slots List */}
          <div className="space-y-3">
            <label className="block font-bold text-xs text-gray-800">Active Daily Time Slots</label>
            <div className="flex flex-wrap gap-2">
              {config.timeSlots.map((slot, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-100 text-[#2CB5A0] font-bold text-xs flex items-center gap-2"
                >
                  {slot}
                  <button onClick={() => handleRemoveTimeSlot(slot)} className="text-gray-400 hover:text-rose-600 cursor-pointer">
                    ×
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddTimeSlot} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newSlotTime}
                onChange={(e) => setNewSlotTime(e.target.value)}
                placeholder="e.g. 10:00 PM"
                className="flex-1 px-3 py-2 rounded-xl border text-xs outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Add Slot
              </button>
            </form>
          </div>
        </div>

        {/* Holidays & Blackout Dates */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b pb-3">
            <CalendarIcon className="w-5 h-5 text-[#2CB5A0]" />
            <h3 className="font-extrabold text-gray-900 text-sm">Holidays & Blackout Dates</h3>
          </div>

          {/* Holidays */}
          <div className="space-y-3 text-xs">
            <label className="block font-bold text-gray-800">Official Holidays</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {config.holidays.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <span className="font-bold text-gray-900">{h.title}</span>
                    <span className="text-[11px] text-gray-500 ml-2">({h.date})</span>
                  </div>
                  <button onClick={() => handleRemoveHoliday(h.date)} className="text-rose-500 hover:text-rose-700 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddHoliday} className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
              <input
                type="date"
                required
                value={newHolidayDate}
                onChange={(e) => setNewHolidayDate(e.target.value)}
                className="col-span-2 px-3 py-2 rounded-xl border text-xs outline-none"
              />
              <input
                type="text"
                required
                value={newHolidayTitle}
                onChange={(e) => setNewHolidayTitle(e.target.value)}
                placeholder="Holiday Title"
                className="col-span-2 px-3 py-2 rounded-xl border text-xs outline-none"
              />
              <button
                type="submit"
                className="col-span-1 py-2 bg-[#2CB5A0] hover:bg-teal-600 text-white font-bold rounded-xl cursor-pointer"
              >
                Add
              </button>
            </form>
          </div>

          {/* Blocked Dates */}
          <div className="space-y-3 text-xs border-t pt-4">
            <label className="block font-bold text-gray-800">Blocked Maintenance Dates</label>
            <div className="flex flex-wrap gap-2">
              {config.blockedDates.map((date, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 font-bold flex items-center gap-2"
                >
                  {date}
                  <button onClick={() => handleRemoveBlockedDate(date)} className="hover:text-rose-800 cursor-pointer">
                    ×
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddBlockedDate} className="flex gap-2">
              <input
                type="date"
                value={newBlockedDate}
                onChange={(e) => setNewBlockedDate(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border text-xs outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Block Date
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
