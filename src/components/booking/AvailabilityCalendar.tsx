import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Sun, Sunset, Moon, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

interface TimeSlotItem {
  time: string;
  period: string;
  available: boolean;
}

interface AvailabilityCalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedTimeSlot: string;
  onSelectTimeSlot: (slot: string) => void;
  selectedTherapistId?: string;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  selectedDate,
  onSelectDate,
  selectedTimeSlot,
  onSelectTimeSlot,
  selectedTherapistId,
}) => {
  const [slots, setSlots] = useState<TimeSlotItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate next 14 available dates
  const datesList = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const dayNum = d.getDate();
    return {
      dateStr,
      dayName,
      monthName,
      dayNum,
      isToday: i === 0,
      isTomorrow: i === 1,
    };
  });

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const data = await api.getAvailability(selectedDate, selectedTherapistId);
        setSlots(data.slots || []);
      } catch (err) {
        console.error('Error fetching availability:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [selectedDate, selectedTherapistId]);

  const safeSlots = slots || [];
  const groupSlots = {
    morning: safeSlots.filter((s) => s?.period === 'morning'),
    afternoon: safeSlots.filter((s) => s?.period === 'afternoon'),
    evening: safeSlots.filter((s) => s?.period === 'evening'),
    night: safeSlots.filter((s) => s?.period === 'night'),
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Date Horizontal Carousel Picker */}
      <div className="bg-[#121A1C] p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex items-center justify-between mb-3.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#2CB5A0]" />
            <span>1. Select Preferred Date</span>
          </label>
          <span className="text-xs text-[#81E3D4] font-semibold bg-[#2CB5A0]/15 px-3 py-1 rounded-full border border-[#2CB5A0]/30">
            {selectedDate}
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none pt-1">
          {datesList.map((item) => {
            const isSelected = item.dateStr === selectedDate;
            return (
              <button
                key={item.dateStr}
                id={`date-select-${item.dateStr}`}
                type="button"
                onClick={() => onSelectDate(item.dateStr)}
                className={`flex-shrink-0 w-20 py-3.5 px-2 rounded-2xl border text-center transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-linear-to-b from-[#2CB5A0] to-[#1A6E61] text-white border-transparent shadow-lg shadow-[#2CB5A0]/20 scale-105'
                    : 'bg-[#182225] border-white/10 text-gray-300 hover:border-[#2CB5A0]/50 hover:bg-[#1E2C2F]'
                }`}
              >
                {item.isToday && (
                  <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-extrabold px-2 py-0.5 rounded-full ${isSelected ? 'bg-[#E3C99B] text-black' : 'bg-[#2CB5A0] text-white'}`}>
                    Today
                  </span>
                )}
                {item.isTomorrow && (
                  <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-extrabold px-2 py-0.5 rounded-full ${isSelected ? 'bg-[#E3C99B] text-black' : 'bg-gray-700 text-gray-200'}`}>
                    Tomorrow
                  </span>
                )}
                <span className={`block text-[11px] font-bold uppercase ${isSelected ? 'text-teal-100' : 'text-gray-400'}`}>
                  {item.dayName}
                </span>
                <span className="block text-2xl font-serif font-extrabold my-0.5 text-white">
                  {item.dayNum}
                </span>
                <span className={`block text-[10px] font-medium ${isSelected ? 'text-teal-100' : 'text-gray-400'}`}>
                  {item.monthName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots Grid */}
      <div className="bg-[#121A1C] p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#2CB5A0]" />
            <span>2. Select Time Slot</span>
          </label>
          {loading ? (
            <span className="text-xs text-[#81E3D4] animate-pulse flex items-center gap-1">
              Checking real-time slots...
            </span>
          ) : (
            selectedTimeSlot && (
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-md">
                Selected: {selectedTimeSlot}
              </span>
            )
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-12 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {/* Morning */}
            {groupSlots.morning.length > 0 && (
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-400" /> Morning Sessions (09:00 AM - 12:00 PM)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {groupSlots.morning.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        id={`time-slot-${slot.time.replace(/[^a-zA-Z0-9]/g, '')}`}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => onSelectTimeSlot(slot.time)}
                        className={`py-3 px-3.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#2CB5A0] text-white border-transparent shadow-lg shadow-[#2CB5A0]/25 scale-[1.02]'
                            : slot.available
                            ? 'bg-[#182225] border-white/10 text-gray-200 hover:border-[#2CB5A0] hover:bg-[#1E2C2F]'
                            : 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed line-through opacity-60'
                        }`}
                      >
                        <span>{slot.time}</span>
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        ) : !slot.available ? (
                          <span className="text-[10px] text-rose-400 font-extrabold no-underline">Booked</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Afternoon */}
            {groupSlots.afternoon.length > 0 && (
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sunset className="w-4 h-4 text-orange-400" /> Afternoon Sessions (12:00 PM - 05:00 PM)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {groupSlots.afternoon.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        id={`time-slot-${slot.time.replace(/[^a-zA-Z0-9]/g, '')}`}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => onSelectTimeSlot(slot.time)}
                        className={`py-3 px-3.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#2CB5A0] text-white border-transparent shadow-lg shadow-[#2CB5A0]/25 scale-[1.02]'
                            : slot.available
                            ? 'bg-[#182225] border-white/10 text-gray-200 hover:border-[#2CB5A0] hover:bg-[#1E2C2F]'
                            : 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed line-through opacity-60'
                        }`}
                      >
                        <span>{slot.time}</span>
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        ) : !slot.available ? (
                          <span className="text-[10px] text-rose-400 font-extrabold no-underline">Booked</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Evening & Night */}
            {(groupSlots.evening.length > 0 || groupSlots.night.length > 0) && (
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-indigo-400" /> Evening & Night Sessions (05:00 PM - 10:00 PM)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {[...groupSlots.evening, ...groupSlots.night].map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        id={`time-slot-${slot.time.replace(/[^a-zA-Z0-9]/g, '')}`}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => onSelectTimeSlot(slot.time)}
                        className={`py-3 px-3.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#2CB5A0] text-white border-transparent shadow-lg shadow-[#2CB5A0]/25 scale-[1.02]'
                            : slot.available
                            ? 'bg-[#182225] border-white/10 text-gray-200 hover:border-[#2CB5A0] hover:bg-[#1E2C2F]'
                            : 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed line-through opacity-60'
                        }`}
                      >
                        <span>{slot.time}</span>
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        ) : !slot.available ? (
                          <span className="text-[10px] text-rose-400 font-extrabold no-underline">Booked</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
