"use client";
import { useState } from "react";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function pad(n) {
  return String(n).padStart(2, "0");
}

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
  // WAT = UTC+1
  const now = new Date();
  return new Date(now.getTime() + 60 * 60 * 1000);
}

export default function BookingWidget() {
  const today = getTodayWAT();
  const [step, setStep] = useState(1);
  const [viewYear, setViewYear] = useState(today.getUTCFullYear());
  const [viewMonth, setViewMonth] = useState(today.getUTCMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", note: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  const todayStr =
    today.getUTCFullYear() +
    "-" + pad(today.getUTCMonth() + 1) +
    "-" + pad(today.getUTCDate());

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
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

  function isToday(d) {
    return Boolean(d && toDateStr(d) === todayStr);
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
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
      const res = await fetch("/api/availability?date=" + dateStr);
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
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim()) {
      return setFormError("Please enter your name.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return setFormError("Please enter a valid email address.");
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedSlot,
          name: form.name.trim(),
          email: form.email.trim(),
          note: form.note.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setConfirmed({
        date: selectedDate,
        time: selectedSlot,
        name: form.name.trim(),
        email: form.email.trim(),
      });
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

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#09051e] px-8 py-6">
        <h3 className="text-xl font-bold text-white mb-1">
          Schedule a Free Consultation
        </h3>
        <p className="text-white/50 text-sm">
          30-minute call &middot; Mon&ndash;Fri, 9 AM &ndash; 5 PM WAT
        </p>

        {step < 4 && (
          <div className="flex items-center gap-2 mt-5">
            {stepLabels.map((label, i) => {
              const num = i + 1;
              const active = step === num;
              const done = step > num;
              return (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all " +
                      (done
                        ? "bg-[#06b6d4] text-white"
                        : active
                        ? "bg-[#7c3aed] text-white"
                        : "bg-white/10 text-white/40")
                    }
                  >
                    {done ? "✓" : num}
                  </div>
                  <span
                    className={
                      "text-xs font-medium " +
                      (active ? "text-white" : "text-white/40")
                    }
                  >
                    {label}
                  </span>
                  {i < stepLabels.length - 1 && (
                    <div
                      className={
                        "w-8 h-px " +
                        (done ? "bg-[#06b6d4]" : "bg-white/15")
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-8">
        {/* ── Step 1: Pick a Date ─────────────────────────────────── */}
        {step === 1 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevMonth}
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#7c3aed] hover:text-[#7c3aed] transition-colors cursor-pointer text-lg"
              >
                &#8249;
              </button>
              <span className="font-semibold text-[#1e1b4b]">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button
                onClick={nextMonth}
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#7c3aed] hover:text-[#7c3aed] transition-colors cursor-pointer text-lg"
              >
                &#8250;
              </button>
            </div>

            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-semibold text-gray-400 py-1"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((d, i) => {
                const sel = isSelectable(d);
                const tod = isToday(d);
                return (
                  <button
                    key={i}
                    disabled={!sel}
                    onClick={() => sel && selectDate(d)}
                    className={
                      "relative aspect-square rounded-lg text-sm font-medium flex flex-col items-center justify-center transition-all " +
                      (!d ? "invisible " : "") +
                      (sel
                        ? "cursor-pointer hover:bg-[#7c3aed] hover:text-white text-[#1e1b4b]"
                        : "text-gray-300 cursor-not-allowed")
                    }
                  >
                    {d}
                    {tod && (
                      <span
                        className={
                          "absolute bottom-1 w-1 h-1 rounded-full " +
                          (sel ? "bg-[#06b6d4]" : "bg-gray-300")
                        }
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 2: Pick a Time ─────────────────────────────────── */}
        {step === 2 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => setStep(1)}
                className="text-sm text-[#7c3aed] hover:underline cursor-pointer"
              >
                &#8592; Back
              </button>
              {selectedDate && (
                <span className="text-sm text-gray-500">
                  {formatDisplayDate(selectedDate)}
                </span>
              )}
            </div>

            {slotsLoading && (
              <div className="flex items-center justify-center py-12 text-gray-400">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-[#7c3aed]"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Checking availability&hellip;
              </div>
            )}

            {slotsError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {slotsError}
              </div>
            )}

            {!slotsLoading && !slotsError && slots.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <p className="mb-3">No available slots for this date.</p>
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-[#7c3aed] hover:underline cursor-pointer"
                >
                  Choose another date
                </button>
              </div>
            )}

            {!slotsLoading && slots.length > 0 && (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  All times in WAT (West Africa Time)
                </p>
                <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setStep(3);
                      }}
                      className={
                        "py-2.5 px-3 rounded-lg border text-sm font-medium transition-all cursor-pointer " +
                        (selectedSlot === slot
                          ? "bg-[#7c3aed] border-[#7c3aed] text-white"
                          : "border-gray-200 text-[#1e1b4b] hover:border-[#7c3aed] hover:text-[#7c3aed]")
                      }
                    >
                      {formatTime(slot)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Step 3: Enter Details ───────────────────────────────── */}
        {step === 3 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => setStep(2)}
                className="text-sm text-[#7c3aed] hover:underline cursor-pointer"
              >
                &#8592; Back
              </button>
              {selectedDate && selectedSlot && (
                <span className="text-sm text-gray-500">
                  {formatDisplayDate(selectedDate)} &middot;{" "}
                  {formatTime(selectedSlot)}
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
                <label className="block text-sm font-semibold text-[#1e1b4b] mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Jane Smith"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-[#7c3aed] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1e1b4b] mb-1.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="jane@company.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-[#7c3aed] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1e1b4b] mb-1.5">
                  Notes{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  name="note"
                  rows={3}
                  value={form.note}
                  onChange={handleFormChange}
                  placeholder="Brief description of what you would like to discuss&hellip;"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-[#7c3aed] outline-none transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-3.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Confirming&hellip;
                  </span>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </form>
          </div>
        )}

        {/* ── Step 4: Confirmation ────────────────────────────────── */}
        {step === 4 && confirmed && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-[#1e1b4b] mb-2">
              Booking Confirmed!
            </h4>
            <p className="text-gray-500 text-sm mb-6">
              A calendar invite has been sent to{" "}
              <strong>{confirmed.email}</strong>.
            </p>

            <div className="bg-[#faf8ff] border border-[#7c3aed]/15 rounded-xl p-5 text-left space-y-3 mb-6">
              <div className="flex gap-3 text-sm">
                <span className="text-gray-400 w-16 flex-shrink-0">Date</span>
                <span className="font-semibold text-[#1e1b4b]">
                  {formatDisplayDate(confirmed.date)}
                </span>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-gray-400 w-16 flex-shrink-0">Time</span>
                <span className="font-semibold text-[#1e1b4b]">
                  {formatTime(confirmed.time)} WAT
                </span>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-gray-400 w-16 flex-shrink-0">With</span>
                <span className="font-semibold text-[#1e1b4b]">
                  {confirmed.name}
                </span>
              </div>
            </div>

            <button
              onClick={reset}
              className="text-sm text-[#7c3aed] hover:underline cursor-pointer"
            >
              Book another slot
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
