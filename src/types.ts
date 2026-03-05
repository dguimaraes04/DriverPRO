import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface User {
  id: string;
  name: string;
  email: string;
  profile_image?: string;
  plan: string;
  trial_start_date: string;
}

export interface DailyRecord {
  id: number;
  user_id: string;
  date: string;
  revenue: number;
  fuel: number;
  food: number;
  hours: number;
  km: number;
  profit: number;
  gain_per_hour: number;
}

export interface Settings {
  user_id: string;
  consumption_km_l: number;
  fuel_price: number;
  cost_per_km: number;
  monthly_goal: number;
  work_days_month: number;
}

export interface Ride {
  id: number;
  user_id: string;
  date: string;
  value: number;
  km: number;
  profit: number;
  value_per_km: number;
  is_target_met: boolean;
}

export interface DashboardStats {
  today: DailyRecord | null;
  weekly: { date: string; profit: number }[];
  weeklySummary: {
    totalProfit: number;
    totalHours: number;
    avgGainPerHour: number;
  };
  settings: Settings;
  recentRides?: Ride[];
}
