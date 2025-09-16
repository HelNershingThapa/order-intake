// components/custom/zod-errors.tsx
import * as React from "react";

type Props = {
  error?: string[] | string; // single or multiple messages
  id?: string;
  className?: string;
};

export function ZodErrors({ error, id, className }: Props) {
  const msgs = Array.isArray(error) ? error : error ? [error] : [];
  if (msgs.length === 0) return null;

  return (
    <div
      id={id}
      role="alert"
      className={["text-red-600 text-xs mt-1", className]
        .filter(Boolean)
        .join(" ")}
    >
      {msgs.map((m, i) => (
        <p key={i}>{m}</p>
      ))}
    </div>
  );
}

export default ZodErrors;
