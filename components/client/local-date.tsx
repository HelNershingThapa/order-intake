"use client";

import { useEffect, useState } from "react";

export default function LocalDate({ isoDate }: { isoDate: string }) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (isoDate) {
      const date = new Date(isoDate);
      setFormattedDate(date.toLocaleDateString());
    }
  }, [isoDate]);

  return <>{formattedDate || "-"}</>;
}
