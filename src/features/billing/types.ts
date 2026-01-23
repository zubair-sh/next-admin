// Billing types
export interface Subscription {
  id: string;
  plan: string;
  status: "active" | "canceled" | "past_due";
  currentPeriodEnd: Date;
}
