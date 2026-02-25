// utils/checkout.ts
export const calculateTotalDays = (
  rentalMode: RentalMode,
  daysCount: number,
  weeksCount: number,
  monthlyStart: string,
  monthlyEnd: string,
): number => {
  switch (rentalMode) {
    case "days":
      return daysCount;
    case "weekly":
      return weeksCount * 7;
    case "monthly":
      if (monthlyStart && monthlyEnd) {
        const start = new Date(monthlyStart);
        const end = new Date(monthlyEnd);
        const diff = Math.ceil(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
        );
        return Math.max(1, diff);
      }
      return 30;
    default:
      return 1;
  }
};

export const getRentalLabel = (
  rentalMode: RentalMode,
  daysCount: number,
  weeksCount: number,
  totalDays: number,
  monthlyStart: string,
  monthlyEnd: string,
): string => {
  switch (rentalMode) {
    case "days":
      return `${daysCount} day${daysCount > 1 ? "s" : ""}`;
    case "weekly":
      return `${weeksCount} week${weeksCount > 1 ? "s" : ""} (${totalDays} days)`;
    case "monthly":
      if (monthlyStart && monthlyEnd) return `${totalDays} days`;
      return "30 days";
    default:
      return "";
  }
};

export const validateEmail = (email: string): boolean => {
  return /\S+@\S+\.\S+/.test(email);
};
