import { format } from "date-fns";

export function formatDate(
  date?: string | Date,
  dateFormat: string = "dd/MM/yyyy",
): string {
  if (!date) return "";
  return format(date instanceof Date ? date : new Date(date), dateFormat);
}
