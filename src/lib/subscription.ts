import { User } from '../types';

export const TRIAL_DAYS = 7;

export interface SubscriptionStatus {
    isTrial: boolean;
    isPro: boolean;
    isExpired: boolean;
    daysRemaining: number;
}

export function getSubscriptionStatus(user: User | null): SubscriptionStatus {
    if (!user) {
        return { isTrial: false, isPro: false, isExpired: true, daysRemaining: 0 };
    }

    if (user.plan === 'pro') {
        return { isTrial: false, isPro: true, isExpired: false, daysRemaining: 999 };
    }

    const startDate = new Date(user.trial_start_date);
    const now = new Date();
    const diffTime = now.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, TRIAL_DAYS - diffDays);

    return {
        isTrial: user.plan === 'trial',
        isPro: false,
        isExpired: diffDays >= TRIAL_DAYS,
        daysRemaining
    };
}
