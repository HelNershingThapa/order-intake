/**
 * Utility functions for handling timezone conversions
 */

/**
 * Convert local time to UTC format with timezone info
 * @param timeString - Time in HH:MM format
 * @returns Time in UTC format like "08:32:38.301Z"
 */
export function convertLocalTimeToUTC(timeString: string): string {
  if (!timeString) return timeString;

  // Create a date object with today's date and the provided time
  const today = new Date();
  const [hours, minutes] = timeString.split(":").map(Number);

  // Create a date in the user's local timezone
  const localDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    hours,
    minutes,
    0,
  );

  // Convert to UTC and format as HH:MM:SS.sssZ
  return localDate.toISOString().split("T")[1]; // Returns format like "08:32:38.301Z"
}

/**
 * Convert UTC time back to local time for display
 * @param utcTimeString - Time in UTC format like "08:32:38.301Z" or "HH:MM:SS"
 * @returns Time in local timezone format HH:MM
 */
export function convertUTCToLocalTime(utcTimeString: string): string {
  if (!utcTimeString) return utcTimeString;

  try {
    // Handle both "HH:MM:SS.sssZ" and "HH:MM" formats
    let timeToConvert = utcTimeString;
    if (utcTimeString.includes("Z")) {
      // Extract just the time part and remove the Z
      timeToConvert = utcTimeString.replace("Z", "");
    }

    // Create a UTC date with today's date and the provided time
    const today = new Date();
    const [hours, minutes, seconds = "0"] = timeToConvert.split(":");
    const utcDate = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds.split(".")[0]),
      ),
    );

    // Convert to local timezone and format as HH:MM
    return utcDate.toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error converting UTC time to local:", error);
    return utcTimeString;
  }
}
