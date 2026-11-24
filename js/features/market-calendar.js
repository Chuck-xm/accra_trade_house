import { toast } from "../core/toast.js";
import { onAction } from "../core/events.js";
export function downloadCalendar() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Accra Trade House Prototype//EN",
    "BEGIN:VEVENT",
    "UID:ath-friday-market-20261127@prototype.local",
    "DTSTAMP:20261124T000000Z",
    "DTSTART:20261127T080000Z",
    "DTEND:20261127T190000Z",
    "SUMMARY:Accra Trade House Friday Market (prototype listing)",
    "LOCATION:Accra Trade House - exact location to be confirmed",
    "DESCRIPTION:Prototype listing. Confirm arrangements with organisers before visiting.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(
    new Blob([ics], { type: "text/calendar;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "accra-friday-market.ics";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Calendar event downloaded. Confirm event details before visiting.");
}
export function initMarketCalendar() {
  onAction("#download-calendar", downloadCalendar);
}
