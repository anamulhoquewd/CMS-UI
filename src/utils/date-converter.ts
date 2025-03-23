const shortToLongDays: Record<string, string> = {
  sa: "saturday",
  su: "sunday",
  mo: "monday",
  tu: "tuesday",
  we: "wednesday",
  th: "thursday",
  fr: "friday",
};
const longToShortDays: Record<string, string> = {
  saturday: "sa",
  sunday: "su",
  monday: "mo",
  tuesday: "tu",
  wednesday: "we",
  thursday: "th",
  friday: "fr",
};

const shortToLong = (days: string[]) => {
  return (
    days
      .map((day) => shortToLongDays[day.toLowerCase()]) // Convert to long names
      .filter(Boolean) || []
  ); // Remove undefined values
};

const logToShort = (days: string[]) => {
  return (
    days
      .map((day) => longToShortDays[day.toLowerCase()]) // Convert to long names
      .filter(Boolean) || []
  ); // Remove undefined values
};

export { shortToLong, logToShort };
