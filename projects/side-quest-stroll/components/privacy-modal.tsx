"use client";

import { Button, Modal } from "@/components/ui";

interface PrivacyModalProps {
  open: boolean;
  onAcknowledge: () => void;
}

/**
 * One-time privacy / data popup. The page only shows this on first run;
 * tapping "Understood" persists the acknowledgement so it doesn't appear
 * again.
 */
export function PrivacyModal({ open, onAcknowledge }: PrivacyModalProps) {
  return (
    <Modal
      open={open}
      onClose={onAcknowledge}
      eyebrow="// FIRST RUN · DATA"
      title="Where your data lives."
    >
      <div className="space-y-3 text-sm text-ink-2">
        <p>
          Your start pin and quest history live <strong className="text-ink">on this device only</strong>.
          Nothing about your location, route, or quest is sent anywhere.
        </p>
        <p>
          Two services are used while a quest is active:
        </p>
        <ul className="space-y-1 pl-4 [&>li]:list-disc">
          <li>
            <strong className="text-ink">CARTO + OpenStreetMap</strong> for map tiles. They see your map view but not your pin.
          </li>
          <li>
            <strong className="text-ink">OSRM</strong> (public demo server) for walking routes. The start and target coordinates of an active quest are sent to compute the route.
          </li>
        </ul>
        <p className="text-xs text-mute">
          Both run anonymously. No account, no email. Clearing the project's
          data wipes everything from this device.
        </p>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onAcknowledge} variant="primary">
          Understood
        </Button>
      </div>
    </Modal>
  );
}
