import { setAnnounceListener } from "@/lib/announcer";
import { useEffect, useState } from "react";

export const StatusAnnouncer = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // A repeated identical message wouldn't re-render (and so wouldn't be
    // re-announced); suffix a non-breaking space to force the change.
    setAnnounceListener((next) =>
      setMessage((prev) => (prev === next ? next + String.fromCharCode(160) : next))
    );
    return () => setAnnounceListener(null);
  }, []);

  useEffect(() => {
    if (!message) return;
    // Clear after announcing so the region doesn't hold stale text.
    const t = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {message}
    </div>
  );
};
