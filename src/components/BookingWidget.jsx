"use client";
import { useState } from "react";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function pad(n) { return String(n).padStart(2, "0"); }

function formatDisplayDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return MONTHS[m - 1] + " " + d + ", " + y;
}

function formatTime(slot) {
  const [h, m] = slot.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return displayH + ":" + pad(m) + " " + ampm;
}

function getTodayWAT() {
  const now = new Date();
  return new Date(now.getTime() + 60 * 60 * 1000);
}

export default function BookingWidget() {
  const today = getTodayWAT();
  const [step, setStep]                   = useState(1);
  const [viewYear, setViewYear]           = useState(today.getUTCFullYear());
  const [viewMonth, setViewMonth]         = useState(today.getUTCMonth());
  const [selectedDate, setSelectedDate]   = useState(null);
  const [slots, setSlots]                 = useState([]);
  const [slotsLoading, setSlotsLoading]   = useState(false);
  const [slotsError, setSlotsError]       = useState("");
  const [selectedSlot, setSelectedSlot]   = useState(null);
  const [form, setForm]                   = useState({ name: "", email: "", note: "" });
  const [formError, setFormError]         = useState("");
  const [submitting, setSubmitting]       = useState(false);
  const [confirmed, setConfirmed]         = useState(null);

  const todayStr =
    today.getUTCFullYear() + "-" +
    pad(today.getUTCMonth() + 1) + "-" +
    pad(today.getUTCDate());

  const firstDay     = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth  = new Date(viewYear, viewMonth + 1, 0).getDate();
  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  function toDateStr(d) {
    return viewYear + "-" + pad(viewMonth + 1) + "-" + pad(d);
  }

  function isSelectable(d) {
    if (!d) return false;
    if (toDateStr(d) < todayStr) return false;
    const dow = new Date(viewYear, viewMonth, d).getDay();
    return dow !== 0 && dow !== 6;
  }

  function isToday(d) { return Boolean(d && toDateStr(d) === todayStr); }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  async function selectDate(d) {
    const dateStr = toDateStr(d);
    setSelectedDate(dateStr);
    setSelectedSlot(null);
    setSlots([]);
    setSlotsError("");
    setSlotsLoading(true);
    setStep(2);
    try {
      const res  = await fetch("/api/availability?date=" + dateStr);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load slots");
      setSlots(data.slots);
    } catch {
      setSlotsError("Could not load availability. Please try another date.");
    } finally {
      setSlotsLoading(false);
    }
  }

  function handleFormChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim())  return setFormError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setFormError("Please enter a valid email address.");
    if (!form.note.trim())  return setFormError("Please describe what you would like to discuss.");
    setSubmitting(true);
    try {
      const res  = await fetch("/api/book", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ date: selectedDate, time: selectedSlot, name: form.name.trim(), email: form.email.trim(), note: form.note.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setConfirmed({ date: selectedDate, time: selectedSlot, name: form.name.trim(), email: form.email.trim() });
      setStep(4);
    } catch (err) {
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setStep(1);
    setSelectedDate(null);
    setSelectedSlot(null);
    setSlots([]);
    setSlotsError("");
    setForm({ name: "", email: "", note: "" });
    setFormError("");
    setConfirmed(null);
  }

  const stepLabels = ["Date", "Time", "Details"];
  const inputClass = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-white";

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-black mb-0.5">
              Schedule a Free Consultation
            </h3>
            <p className="text-xs text-gray-400">
              30-minute call &middot; Mon&ndash;Fri, 9 AM &ndash; 5 PM WAT
            </p>
          </div>
        </div>

        {/* Step indicator */}
        {step < 4 && (
          <div className="flex items-center gap-1.5 mt-4">
            {stepLabels.map((label, i) => {
              const num    = i + 1;
              const active = step === num;
              const done   = step > num;
              return (
                <div key={label} className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      done   ? "bg-[#7c3aed] text-white" :
                      active ? "bg-[#7c3aed] text-white" :
                               "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {done ? (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : num}
                  </div>
                  <span className={`text-xs font-medium ${active ? "text-black" : "text-gray-400"}`}>
                    {label}
                  </span>
                  {i < stepLabels.length - 1 && (
                    <div className={`w-6 h-px mx-1 ${done ? "bg-[#7c3aed]" : "bg-gray-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-6">

        {/* Step 1 — Pick a date */}
        {step === 1 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={prevMonth}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors text-lg cursor-pointer"
              >
                &#8249;
              </button>
              <span className="text-sm font-semibold text-black">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button
                onClick={nextMonth}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors text-lg cursor-pointer"
              >
                &#8250;
              </button>
            </div>

            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(d => (
                <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
              {calendarCells.map((d, i) => {
                const sel = isSelectable(d);
                const tod = isToday(d);
                return (
                  <button
                    key={i}
                    disabled={!sel}
                    onClick={() => sel && selectDate(d)}
                    className={`relative aspect-square rounded-lg text-sm font-medium flex flex-col items-center justify-center transition-all ${
                      !d       ? "invisible" :
                      sel      ? "cursor-pointer hover:bg-[#7c3aed] hover:text-white text-black" :
                                 "text-gray-300 cursor-not-allowed"
                    } ${tod && sel ? "ring-1 ring-black ring-offset-1" : ""}`}
                  >
                    {d}
                    {tod && (
                      <span className={`absolute bottom-1 w-1 h-1 rounded-full ${sel ? "bg-[#7c3aed]" : "bg-gray-200"}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2 — Pick a time */}
        {step === 2 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => setStep(1)} className="text-sm text-black hover:text-gray-500 transition-colors cursor-pointer flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              {selectedDate && (
                <span className="text-sm text-gray-400">{formatDisplayDate(selectedDate)}</span>
              )}
            </div>

            {slotsLoading && (
              <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
                <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-sm">Checking availability…</span>
              </div>
            )}

            {slotsError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {slotsError}
              </div>
            )}

            {!slotsLoading && !slotsError && slots.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <p className="text-sm mb-3">No available slots for this date.</p>
                <button onClick={() => setStep(1)} className="text-sm text-black hover:text-gray-500 transition-colors cursor-pointer underline">
                  Choose another date
                </button>
              </div>
            )}

            {!slotsLoading && slots.length > 0 && (
              <>
                <p className="text-xs text-gray-400 mb-3">All times in WAT (West Africa Time)</p>
                <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                  {slots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => { setSelectedSlot(slot); setStep(3); }}
                      className={`py-2.5 px-2 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                        selectedSlot === slot
                          ? "bg-[#7c3aed] border-[#7c3aed] text-white"
                          : "border-gray-200 text-black hover:border-[#7c3aed] hover:bg-[#7c3aed] hover:text-white"
                      }`}
                    >
                      {formatTime(slot)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 3 — Details */}
        {step === 3 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => setStep(2)} className="text-sm text-black hover:text-gray-500 transition-colors cursor-pointer flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              {selectedDate && selectedSlot && (
                <span className="text-sm text-gray-400">
                  {formatDisplayDate(selectedDate)} &middot; {formatTime(selectedSlot)}
                </span>
              )}
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-1.5">
                  Full Name <span className="text-red-400 font-normal">*</span>
                </label>
                <input name="name" required value={form.name} onChange={handleFormChange} placeholder="Jane Smith" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1.5">
                  Email Address <span className="text-red-400 font-normal">*</span>
                </label>
                <input name="email" type="email" required value={form.email} onChange={handleFormChange} placeholder="jane@company.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1.5">
                  What would you like to discuss? <span className="text-red-400 font-normal">*</span>
                </label>
                <textarea name="note" rows={3} required value={form.note} onChange={handleFormChange} placeholder="Brief description of your project or topic…" className={`${inputClass} resize-none`} />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#7c3aed] text-white text-sm font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Confirming…
                  </>
                ) : "Confirm Booking"}
              </button>
            </form>
          </div>
        )}

        {/* Step 4 — Confirmation */}
        {step === 4 && confirmed && (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-black mb-1">Booking Confirmed!</h4>
            <p className="text-gray-500 text-sm mb-6">
              A calendar invite has been sent to <span className="font-semibold text-black">{confirmed.email}</span>.
            </p>

            <div className="border border-gray-200 rounded-lg p-4 text-left space-y-3 mb-6 bg-gray-50">
              {[
                { label: "Date", value: formatDisplayDate(confirmed.date) },
                { label: "Time", value: formatTime(confirmed.time) + " WAT" },
                { label: "Name", value: confirmed.name },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3 text-sm">
                  <span className="text-gray-400 w-12 flex-shrink-0">{label}</span>
                  <span className="font-semibold text-black">{value}</span>
                </div>
              ))}
            </div>

            <button onClick={reset} className="text-sm text-black hover:text-gray-500 transition-colors cursor-pointer underline">
              Book another slot
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
