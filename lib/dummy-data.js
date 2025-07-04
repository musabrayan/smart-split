import { Bell, CreditCard, PieChart, Receipt, Users } from "lucide-react";

export const FEATURES = [
  {
    title: "Organized Group Tracking",
    Icon: Users,
    bg: "bg-primary/10",
    color: "text-primary",
    description:
      "Create dedicated groups for trips, roommates, or events and keep all shared expenses in one place.",
  },
  {
    title: "Optimized Settlements",
    Icon: CreditCard,
    bg: "bg-secondary/10",
    color: "text-secondary",
    description:
      "Our smart algorithm reduces the total number of transactions needed when it's time to settle up.",
  },
  {
    title: "Visual Spending Insights",
    Icon: PieChart,
    bg: "bg-accent/10",
    color: "text-accent",
    description:
      "Get detailed charts and analytics to understand how your group spends and shares costs.",
  },
  {
    title: "Automatic Reminders",
    Icon: Bell,
    bg: "bg-muted",
    color: "text-muted-foreground",
    description:
      "Stay on top of your dues with timely reminders and updates on outstanding payments.",
  },
  {
    title: "Flexible Splitting Options",
    Icon: Receipt,
    bg: "bg-primary/10",
    color: "text-primary",
    description:
      "Split bills evenly, by percentage, or assign custom amounts — perfect for any expense type.",
  },
  {
    title: "Instant Sync Across Devices",
    Icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 14v8M15 14v8M9 2v6M15 2v6" />
      </svg>
    ),
    bg: "bg-secondary/10",
    color: "text-secondary",
    description:
      "Changes are reflected instantly. See updates as soon as friends log new expenses or payments.",
  },
];

export const STEPS = [
  {
    label: "1",
    title: "Start or Join a Group",
    description:
      "Launch a group for your event or living situation and invite members with a simple link.",
  },
  {
    label: "2",
    title: "Log Shared Expenses",
    description:
      "Add expenses, select who paid, and choose how the cost should be divided.",
  },
  {
    label: "3",
    title: "Track & Settle Debts",
    description:
      "See an up-to-date list of who owes whom and settle balances easily within the app.",
  },
];
